// ─── Score helpers ──────────────────────────────────────────────────────────
export const scoreColor = (s) => s >= 90 ? "#16a34a" : s >= 75 ? "#E8360A" : "#dc2626";
export const scoreLabel = (s) => s >= 90 ? "Excellent" : s >= 75 ? "Good" : "Fair";
export const scorePillBg = (s) =>
    s >= 90
        ? "bg-green-100 text-green-700"
        : s >= 75
            ? "bg-orange-100 text-[#B52800]"
            : "bg-red-100 text-red-700";
