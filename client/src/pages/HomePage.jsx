import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon, MapPin, Receipt, Star, TrendingUp, Flame, Heart, Clock,
} from "lucide-react";
import { cuisines } from "../lib/mockData";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import WorthItBadge from "../components/WorthItBadge";
import ScorePill from "../components/ScorePill";
import SectionHead from "../components/SectionHead";
import SnapScanScore from "../components/SnapScanScore";

// Time-aware greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Render image_url as <img> if URL, otherwise as an emoji
function RestaurantThumb({ imageUrl, className, emojiClass = "float-emoji" }) {
  const isUrl = imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"));
  if (isUrl) {
    return <img src={imageUrl} alt="" className={className || "w-full h-full object-cover"} />;
  }
  return <span className={emojiClass}>{imageUrl || "🍽️"}</span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRest, setLoadingRest] = useState(true);
  const [restError, setRestError] = useState(null);
  const [bills, setBills] = useState([]);
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.restaurants.list()
      .then(setRestaurants)
      .catch((e) => setRestError(e.message))
      .finally(() => setLoadingRest(false));
  }, []);

  useEffect(() => {
    if (user?.id) api.bills.list({ userId: user.id }).then(setBills).catch(console.error);
  }, [user]);

  // Real stats from actual bill data
  const totalSpent = bills.reduce((a, b) => a + (b.amount || 0), 0);
  const avgRating = bills.length
    ? (bills.reduce((a, b) => a + (b.avg_rating > 0 ? b.avg_rating : 0), 0) / bills.filter(b => b.avg_rating > 0).length || 0).toFixed(1)
    : null;

  // Build top dish feed from real restaurant data
  const topDishFeed = restaurants.flatMap((r) =>
    (r.top_dishes || []).map((d) => ({
      dish: d.name,
      restaurant: r.name,
      restaurantId: r.id,
      price: d.price,
      score: r.worth_it_score ?? 75,
      emoji: d.emoji || "🍽️",
      cuisine: r.cuisine,
    }))
  );

  const filtered = topDishFeed.filter(
    (d) =>
      (activeCuisine === "All" || d.cuisine === activeCuisine) &&
      (d.dish.toLowerCase().includes(search.toLowerCase()) ||
        d.restaurant.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pb-16 w-full">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="hero-food rounded-3xl mt-6 px-10 py-14 relative overflow-hidden border-2" style={{ borderColor: "rgba(232,54,10,0.10)" }}>
        <div className="absolute right-16 top-8 text-6xl float-emoji select-none" style={{ animationDelay: "0s" }}>🍛</div>
        <div className="absolute right-36 bottom-6 text-4xl float-emoji select-none" style={{ animationDelay: "1.2s" }}>🌶️</div>
        <div className="absolute right-6 bottom-12 text-5xl float-emoji select-none" style={{ animationDelay: "0.6s" }}>🍽️</div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E8360A]/10 border border-[#E8360A]/20 text-[#E8360A] text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Flame size={13} className="fill-[#E8360A]" /> {greeting}{profile ? `, ${profile.name.split(" ")[0]}` : ""} 👋
          </div>

          <h1 className="font-display text-6xl font-black text-[#1A0A00] leading-[1.05] mb-4">
            Every Rupee<br />
            <span className="stripe-underline" style={{ color: "#E8360A" }}>Deserves</span>&nbsp;Its Worth
          </h1>
          <p className="text-[#4A2E1A] text-base mb-8 max-w-md leading-relaxed font-medium">
            Scan bills. Rate dishes. Find restaurants that give you the most bang for your buck — verified by India's food community.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <SearchIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6A52]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes or restaurants..."
              className="w-full pl-11 pr-5 py-4 rounded-2xl text-sm font-medium text-[#1A0A00] placeholder-[#8C6A52]/60 outline-none border-2 transition-all focus:border-[#E8360A]/50"
              style={{ background: "#ffffff", borderColor: "rgba(232,54,10,0.15)", boxShadow: "0 4px 16px rgba(232,54,10,0.07)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats Cards (user's real data) ───────────────────── */}
      {user && (
        <div className="grid grid-cols-3 gap-4 mt-8 stagger">
          {[
            { label: "Bills Scanned", value: bills.length ? String(bills.length) : "0", icon: <Receipt size={22} />, color: "#E8360A", bg: "#FDE8D0" },
            { label: "Avg Rating", value: avgRating ? `${avgRating}★` : "—", icon: <Star size={22} className="fill-current" />, color: "#FF9F1C", bg: "#FDE8D0" },
            { label: "Total Spent", value: totalSpent ? `₹${totalSpent.toLocaleString()}` : "₹0", icon: <TrendingUp size={22} />, color: "#16a34a", bg: "#DCFCE7" },
          ].map((s) => (
            <div key={s.label} className="card-warm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="font-display font-black text-xl text-[#1A0A00] leading-none">{s.value}</div>
                <div className="text-[#8C6A52] text-xs mt-1 font-semibold">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Cuisine Chips ────────────────────────────────────── */}
      <div className="mt-10 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {["All", ...cuisines.filter((c) => c !== "All")].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCuisine(c)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap"
            style={activeCuisine === c
              ? { background: "linear-gradient(135deg,#E8360A,#FF9F1C)", color: "#fff", borderColor: "transparent" }
              : { background: "#ffffff", color: "#4A2E1A", borderColor: "rgba(232,54,10,0.12)" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Top Nearby ───────────────────────────────────────── */}
      <div className="mt-12">
        <SectionHead
          sub="Restaurants sorted by Worth-It score"
          action={
            <button onClick={() => navigate("/explore")} className="text-[#E8360A] text-xs font-bold tracking-wider uppercase hover:opacity-70 transition-opacity flex items-center gap-1">
              View all <span>→</span>
            </button>
          }
        >
          🔥 Top Nearby
        </SectionHead>

        {restError ? (
          <div className="card-warm py-12 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-[#4A2E1A] font-bold text-sm">Failed to load restaurants</p>
            <p className="text-[#8C6A52] text-xs mt-1">{restError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {loadingRest
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card-warm overflow-hidden animate-pulse">
                    <div className="h-32" style={{ background: "#FDE8D0" }} />
                    <div className="p-4 space-y-2">
                      <div className="h-3 rounded" style={{ background: "#FDE8D0", width: "70%" }} />
                      <div className="h-3 rounded" style={{ background: "#FDE8D0", width: "50%" }} />
                    </div>
                  </div>
                ))
              : restaurants.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                    className="card-warm cursor-pointer overflow-hidden"
                  >
                    <div className="h-32 flex items-center justify-center text-6xl relative overflow-hidden" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                      <RestaurantThumb
                        imageUrl={r.image_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide" style={{ background: r.tag_color || "#E8360A" }}>
                        {r.tag || r.cuisine}
                      </div>
                      <div className="absolute top-2 right-2">
                        <WorthItBadge score={r.worth_it_score ?? 75} size="sm" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#1A0A00] text-sm leading-tight truncate">{r.name}</h3>
                      <p className="text-[#8C6A52] text-[11px] mt-1 flex items-center gap-1">
                        <MapPin size={9} /> {r.cuisine} · {r.distance ?? "?"} km
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[#E8360A] font-black text-xs">₹{r.avg_cost ?? "—"} for 2</span>
                        <ScorePill score={r.worth_it_score ?? 75} />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* ── Top Rated Dishes ─────────────────────────────────── */}
      <div className="mt-14">
        <SectionHead sub={search ? undefined : "Dishes that give the most value for money"}>
          {search ? `🔍 Results for "${search}"` : "🍽️ Top Rated Dishes"}
        </SectionHead>

        {filtered.length === 0 ? (
          <div className="card-warm py-16 text-center">
            <div className="text-5xl mb-3">😕</div>
            <p className="text-[#8C6A52] text-sm font-semibold">No results found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="card-warm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => item.restaurantId && navigate(`/restaurant/${item.restaurantId}`)}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1A0A00] text-sm truncate">{item.dish}</h3>
                  <p className="text-[#8C6A52] text-xs truncate mt-0.5 flex items-center gap-1">
                    <MapPin size={9} /> {item.restaurant}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#E8360A] font-black text-xs">₹{item.price}</span>
                    <ScorePill score={item.score} />
                  </div>
                </div>
                <WorthItBadge score={item.score} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Snap Scan Score ──────────────────────────────────── */}
      <SnapScanScore />

      {/* ── Smart Savings Feature Section ────────────────────── */}
      <div className="mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest border-2" style={{ background: "#FDE8D0", color: "#E8360A", borderColor: "rgba(232,54,10,0.2)" }}>
              <Receipt size={12} /> Smart Savings
            </div>
            <h2 className="font-display text-5xl font-black text-[#1A0A00] leading-[1.05] mb-4">
              Your Wallet's<br />
              <span className="font-script text-5xl" style={{ color: "#E8360A" }}>Best Friend</span>
            </h2>
            <p className="text-[#4A2E1A] text-base font-medium mb-8 max-w-md leading-relaxed">
              Track your dining expenses, visualise your spending habits, and discover restaurants that give you the most bang for your buck.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Receipt size={18} />, title: "Bill Tracking", sub: "Auto-extract details from photos" },
                { icon: <TrendingUp size={18} />, title: "Spending Insights", sub: "Visualize monthly trends" },
                { icon: <Heart size={18} />, title: "Smart Picks", sub: "Find budget-friendly alternatives" },
                { icon: <Clock size={18} />, title: "Dining History", sub: "Keep a log of every meal" },
              ].map((f) => (
                <div key={f.title} className="card-warm p-4">
                  <div className="mb-2 text-[#E8360A]">{f.icon}</div>
                  <p className="font-bold text-[#1A0A00] text-xs leading-tight">{f.title}</p>
                  <p className="text-[#8C6A52] text-[10px] mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/upload")}
              className="px-8 py-4 rounded-2xl font-bold text-white text-sm shadow-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              Start Tracking Now →
            </button>
          </div>

          {/* Right: your actual stats or a prompt to upload */}
          <div className="card-warm p-6 relative overflow-hidden">
            {user && bills.length > 0 ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-[#1A0A00] text-base">My Dining Profile</p>
                    <p className="text-[#8C6A52] text-xs mt-0.5">{bills.length} bill{bills.length !== 1 ? "s" : ""} uploaded</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0" style={{ background: "#E8360A" }}>
                    {(profile?.name || "?")[0].toUpperCase()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                    <p className="text-[#8C6A52] text-[10px] font-bold uppercase tracking-wider mb-1">Total Spent</p>
                    <p className="font-display font-black text-xl text-[#1A0A00]">₹{totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                    <p className="text-[#8C6A52] text-[10px] font-bold uppercase tracking-wider mb-1">Bills Uploaded</p>
                    <p className="font-display font-black text-xl text-[#1A0A00]">{bills.length} <span className="text-sm font-sans text-[#8C6A52] font-normal">receipts</span></p>
                  </div>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                  <p className="text-[#8C6A52] text-xs font-semibold">Keep uploading your bills to unlock spending insights and Worth-It scores.</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🧾</div>
                <p className="font-bold text-[#1A0A00] text-base mb-2">No bills yet</p>
                <p className="text-[#8C6A52] text-sm mb-6">Upload your first restaurant bill to see your dining stats here.</p>
                <button
                  onClick={() => navigate(user ? "/upload" : "/login")}
                  className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
                >
                  {user ? "Upload a Bill" : "Sign In to Start"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <div
        className="mt-20 rounded-3xl px-10 py-12 flex items-center justify-between overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #E8360A 0%, #FF9F1C 60%, #F7C948 100%)" }}
      >
        <div className="absolute right-0 top-0 text-[160px] opacity-10 select-none leading-none -translate-y-4">🍱</div>
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">Got your bill?</p>
          <h3 className="font-display text-4xl font-black text-white mb-2">Scan it. Rate it. Save more.</h3>
          <p className="text-white/70 text-sm">Upload your restaurant bill and find out if it was Worth-It™</p>
        </div>
        <button
          onClick={() => navigate(user ? "/upload" : "/login")}
          className="relative z-10 bg-white text-[#E8360A] font-display font-black text-sm px-8 py-4 rounded-2xl flex-shrink-0 shadow-xl hover:scale-105 transition-transform"
        >
          {user ? "Upload Bill →" : "Get Started →"}
        </button>
      </div>
    </div>
  );
}
