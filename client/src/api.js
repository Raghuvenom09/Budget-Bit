// Central Axios-free API client using native fetch
// All components import from here — no scattered fetch() calls

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("bb_token");
}

async function request(method, endpoint, body = null) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
    auth: {
        register: (body) => request("POST", "/auth/register", body),
        login: (body) => request("POST", "/auth/login", body),
        me: () => request("GET", "/auth/me"),
    },

    // ── Restaurants ─────────────────────────────────────────────────────────────
    restaurants: {
        list: (params = {}) => {
            const q = new URLSearchParams(params).toString();
            return request("GET", `/restaurants${q ? `?${q}` : ""}`);
        },
        get: (id) => request("GET", `/restaurants/${id}`),
        create: (body) => request("POST", "/restaurants", body),
        update: (id, body) => request("PUT", `/restaurants/${id}`, body),
    },

    // ── Reviews ──────────────────────────────────────────────────────────────────
    reviews: {
        list: (params = {}) => {
            const q = new URLSearchParams(params).toString();
            return request("GET", `/reviews${q ? `?${q}` : ""}`);
        },
        create: (body) => request("POST", "/reviews", body),
        update: (id, body) => request("PUT", `/reviews/${id}`, body),
        remove: (id) => request("DELETE", `/reviews/${id}`),
    },

    // ── Bills / Wallet ───────────────────────────────────────────────────────────
    bills: {
        list: (params = {}) => {
            const q = new URLSearchParams(params).toString();
            return request("GET", `/bills${q ? `?${q}` : ""}`);
        },
        monthlyStats: () => request("GET", "/bills/monthly-stats"),
        create: (body) => request("POST", "/bills", body),
        remove: (id) => request("DELETE", `/bills/${id}`),
    },

    // ── Users ────────────────────────────────────────────────────────────────────
    users: {
        profile: () => request("GET", "/users/profile"),
        update: (body) => request("PUT", "/users/profile", body),
        toggleSave: (restaurantId) => request("POST", `/users/save/${restaurantId}`),
    },
};
