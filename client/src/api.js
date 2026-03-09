// Central API client — uses Supabase for all DB operations
import { supabase } from "./lib/supabase.js";

// ── Helper: throw on Supabase errors ─────────────────────────────────────────
function check({ data, error }) {
    if (error) throw new Error(error.message);
    return data;
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
        monthlyStats: async (userId) => {
            const { data, error } = await supabase
                .from("bills")
                .select("amount, created_at")
                .eq("user_id", userId);
            if (error) throw new Error(error.message);
            return data.reduce((acc, b) => {
                const month = b.created_at.slice(0, 7);
                acc[month] = (acc[month] || 0) + b.amount;
                return acc;
            }, {});
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
        update: (userId, body) =>
            supabase.from("profiles").update(body).eq("id", userId).select().single().then(check),
        toggleSave: async (userId, restaurantId) => {
            const { data: existing } = await supabase
                .from("saved_restaurants")
                .select("id")
                .eq("user_id", userId)
                .eq("restaurant_id", restaurantId)
                .single();
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
};
