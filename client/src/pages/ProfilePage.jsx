import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  User, Star, Receipt, CreditCard, FileText,
  CheckCircle2, TrendingUp, Award, LogOut,
} from "lucide-react";
import SectionHead from "../components/SectionHead";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

// Derive the current month's bills
function currentMonthBills(bills) {
  const now = new Date();
  return bills.filter((b) => {
    const d = new Date(b.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [billsError, setBillsError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBillsLoading(true);
      api.bills.list({ userId: user.id })
        .then(setBills)
        .catch((e) => setBillsError(e.message))
        .finally(() => setBillsLoading(false));
    }
  }, [user]);

  const totalSpent = bills.reduce((a, b) => a + (b.amount || 0), 0);
  const thisMonthBills = currentMonthBills(bills);
  const thisMonthSpent = thisMonthBills.reduce((a, b) => a + (b.amount || 0), 0);
  const avgRating = bills.length
    ? (bills.reduce((a, b) => a + (b.avg_rating || 4.0), 0) / bills.length).toFixed(1)
    : "—";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="pb-16 w-full">
      {/* Hero */}
      <div
        className="rounded-3xl mt-6 px-10 py-12 relative overflow-hidden border-2"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C,#F7C948)", borderColor: "transparent" }}
      >
        <div className="absolute -right-10 -bottom-10 text-[180px] opacity-10 select-none pointer-events-none">👤</div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl" style={{ background: "rgba(255,255,255,0.25)" }}>
            <User size={36} className="text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
              <Award size={11} /> Food Explorer
            </div>
            <h1 className="font-display text-3xl font-black text-white">{profile?.name || user?.email?.split("@")[0] || "Foodie"}</h1>
            <p className="text-white/75 text-sm mt-1 font-medium">{profile?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 stagger">
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, accent: "#3b82f6", bg: "#EFF6FF", icon: <CreditCard size={20} /> },
          { label: "This Month", value: `₹${thisMonthSpent.toLocaleString()}`, accent: "#16a34a", bg: "#DCFCE7", icon: <TrendingUp size={20} /> },
          { label: "Bills Scanned", value: String(bills.length), accent: "#a855f7", bg: "#F3E8FF", icon: <Receipt size={20} /> },
          { label: "Avg Rating", value: `${avgRating}★`, accent: "#FF9F1C", bg: "#FFF7ED", icon: <Star size={20} className="fill-current" /> },
        ].map((s) => (
          <div key={s.label} className="card-warm p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg, color: s.accent }}>
              {s.icon}
            </div>
            <div className="font-display font-black text-2xl text-[#1A0A00] leading-none">{s.value}</div>
            <div className="text-[#8C6A52] text-xs mt-1.5 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* This month summary */}
      {thisMonthBills.length > 0 && (
        <div className="mt-6 rounded-2xl p-5 flex items-center gap-4 border-2" style={{ background: "#DCFCE7", borderColor: "rgba(22,163,74,0.2)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,163,74,0.15)" }}>
            <TrendingUp size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-green-800 font-bold text-sm">
              {thisMonthBills.length} bill{thisMonthBills.length !== 1 ? "s" : ""} this month · ₹{thisMonthSpent.toLocaleString()} spent
            </p>
            <p className="text-green-600 text-xs mt-0.5 font-medium">Keep scanning to build your dining history.</p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <SectionHead sub="Your complete dining history">Past Bills</SectionHead>

        {billsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-warm p-5 animate-pulse h-32" style={{ background: "#FFF8F0" }} />
            ))}
          </div>
        ) : billsError ? (
          <div className="card-warm py-12 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-[#4A2E1A] font-bold text-sm">Failed to load bills</p>
            <p className="text-[#8C6A52] text-xs mt-1">{billsError}</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="card-warm py-16 text-center">
            <div className="text-5xl mb-3">🧻</div>
            <p className="text-[#8C6A52] text-sm font-semibold">No bills yet — upload your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
            {bills.map((bill) => (
              <div key={bill.id} className="card-warm p-5">
                <div className="flex items-start justify-between gap-2 mb-4 pb-4 border-b-2" style={{ borderColor: "rgba(232,54,10,0.07)" }}>
                  <div>
                    <h3 className="font-bold text-[#1A0A00] text-base">{bill.restaurants?.name || "Restaurant"}</h3>
                    <p className="text-[#8C6A52] text-xs mt-1 flex items-center gap-1">
                      <FileText size={10} />
                      {bill.created_at
                        ? new Date(bill.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-black text-[#E8360A] text-lg">₹{bill.amount}</p>
                    {bill.avg_rating && (
                      <div className="flex items-center gap-0.5 mt-1 justify-end">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} className={s <= Math.round(bill.avg_rating) ? "text-[#FF9F1C] fill-[#FF9F1C]" : "text-[#F9C9A0] fill-[#F9C9A0]"} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {Array.isArray(bill.dishes) && bill.dishes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {bill.dishes.map((d, i) => (
                      <span key={i} className="text-[#B52800] font-semibold text-[10px] px-2.5 py-1 rounded-full" style={{ background: "#FDE8D0" }}>{d}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-2 p-2.5 rounded-xl" style={{ background: "#DCFCE7" }}>
                  <CheckCircle2 size={12} className="text-green-600" />
                  <span className="text-green-700 text-[10px] font-black uppercase tracking-wide">Scanned ✓</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-8 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 border-2"
        style={{ borderColor: "rgba(239,68,68,0.15)" }}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
