// Central API client — uses Supabase for all DB operations
import { supabase } from "./lib/supabase.js";

// ── Helper: throw on Supabase errors ─────────────────────────────────────────
function check({ data, error }) {
    if (error) throw new Error(error.message);
    return data;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retryOptions = {}) {
    const { retries = 2, backoffMs = 350 } = retryOptions;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Request failed ${response.status}`);
            }
            return response;
        } catch (error) {
            lastError = error;
            if (attempt === retries) {
                break;
            }
            await sleep(backoffMs * (attempt + 1));
        }
    }

    throw lastError;
}

export const api = {
    // ── Restaurants ──────────────────────────────────────────────────────────────
    restaurants: {
        list: (filters = {}) => {
            let q = supabase.from("restaurants").select("*");
            if (filters.cuisine) q = q.eq("cuisine", filters.cuisine);
            if (filters.maxBudget) q = q.lte("avg_cost", filters.maxBudget);
            if (filters.search) q = q.ilike("name", `%${filters.search}%`);
            return q.order("rating", { ascending: false }).then(check);
        },
        get: (id) =>
            supabase.from("restaurants").select("*, reviews(*)").eq("id", id).single().then(check),
        create: (body) =>
            supabase.from("restaurants").insert(body).select().single().then(check),
        update: (id, body) =>
            supabase.from("restaurants").update(body).eq("id", id).select().single().then(check),
    },

    // ── Reviews ──────────────────────────────────────────────────────────────────
    reviews: {
        list: (filters = {}) => {
            let q = supabase.from("reviews").select("*, restaurants(name, image_url)");
            if (filters.restaurantId) q = q.eq("restaurant_id", filters.restaurantId);
            if (filters.userId) q = q.eq("user_id", filters.userId);
            return q.order("created_at", { ascending: false }).then(check);
        },
        create: (body) =>
            supabase.from("reviews").insert(body).select().single().then(check),
        update: (id, body) =>
            supabase.from("reviews").update(body).eq("id", id).select().single().then(check),
        remove: (id) =>
            supabase.from("reviews").delete().eq("id", id).then(check),
    },

    // ── Bills / Wallet ────────────────────────────────────────────────────────────
    bills: {
        list: (filters = {}) => {
            let q = supabase.from("bills").select("*, restaurants(name)");
            if (filters.userId) q = q.eq("user_id", filters.userId);
            return q.order("created_at", { ascending: false }).then(check);
        },
        create: (body) =>
            supabase.from("bills").insert(body).select().single().then(check),
        remove: (id) =>
            supabase.from("bills").delete().eq("id", id).then(check),
    },

    // ── Users / Profiles ──────────────────────────────────────────────────────────
    users: {
        profile: (userId) =>
            supabase.from("profiles").select("*").eq("id", userId).single().then(check),
        toggleSave: async (userId, restaurantId) => {
            // maybeSingle() returns null (not an error) when no row exists
            const { data: existing } = await supabase
                .from("saved_restaurants")
                .select("id")
                .eq("user_id", userId)
                .eq("restaurant_id", restaurantId)
                .maybeSingle();
            if (existing) {
                return supabase.from("saved_restaurants").delete().eq("id", existing.id).then(check);
            } else {
                return supabase.from("saved_restaurants").insert({ user_id: userId, restaurant_id: restaurantId }).then(check);
            }
        },
        savedList: (userId) =>
            supabase.from("saved_restaurants").select("*, restaurants(*)").eq("user_id", userId).then(check),
    },

    // ── Storage (bill images) ─────────────────────────────────────────────────────
    storage: {
        uploadBillImage: async (userId, file) => {
            const ext = file.name.split(".").pop();
            const path = `${userId}/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from("bill-images").upload(path, file);
            if (error) throw new Error(error.message);
            const { data } = supabase.storage.from("bill-images").getPublicUrl(path);
            return data.publicUrl;
        },
    },

    // ── AI microservice ───────────────────────────────────────────────────────────
    // Set VITE_AI_BASE_URL in client/.env for production; falls back to localhost for dev
    ai: (() => {
        const AI_BASE = (import.meta.env.VITE_AI_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
        return {
            /** Scan a receipt image → [{name, qty, price}] */
            ocr: async (file) => {
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetchWithRetry(`${AI_BASE}/ai/ocr/scan`, {
                    method: "POST",
                    body: fd,
                }, { retries: 2, backoffMs: 400 });
                return res.json();
            },

            /** Get a Worth-It score for a dish */
            score: async (body) => {
                const res = await fetchWithRetry(`${AI_BASE}/ai/score/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }, { retries: 1, backoffMs: 300 });
                return res.json();
            },

            /** Get personalised dish recommendations */
            recommend: async (body) => {
                const res = await fetchWithRetry(`${AI_BASE}/ai/recommend/dishes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }, { retries: 1, backoffMs: 300 });
                return res.json();
            },
        };
    })(),
};
