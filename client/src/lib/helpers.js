// ─── Score helpers ──────────────────────────────────────────────────────────
export const scoreColor = (s) => {
    if (s == null || isNaN(Number(s))) return "#8C6A52";
    return s >= 90 ? "#16a34a" : s >= 75 ? "#D97706" : "#dc2626";
};
export const scoreLabel = (s) => {
    if (s == null || isNaN(Number(s))) return "—";
    return s >= 90 ? "Excellent" : s >= 75 ? "Good" : "Fair";
};
export const scorePillBg = (s) => {
    if (s == null || isNaN(Number(s))) return "bg-gray-100 text-gray-500";
    return s >= 90
        ? "bg-green-100 text-green-700"
        : s >= 75
            ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700";
};
