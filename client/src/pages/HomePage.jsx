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

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRest, setLoadingRest] = useState(true);

  useEffect(() => {
    api.restaurants.list().then(setRestaurants).catch(console.error).finally(() => setLoadingRest(false));
  }, []);

  // Build top dish feed from real restaurant data
  const topDishFeed = restaurants.flatMap((r) =>
    (r.top_dishes || []).map((d) => ({
      dish: d.name,
      restaurant: r.name,
      price: d.price,
      score: r.worth_it_score ?? 75,
      emoji: d.emoji || "🍽️",
    }))
  );

  const filtered = topDishFeed.filter(
    (d) =>
      d.dish.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant.toLowerCase().includes(search.toLowerCase())
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
            <Flame size={13} className="fill-[#E8360A]" /> Good afternoon{profile ? `, ${profile.name.split(" ")[0]}` : ""} 👋
          </div>

          <h1 className="font-display text-6xl font-black text-[#1A0A00] leading-[1.05] mb-4">
            Every Rupee<br />
            <span className="stripe-underline" style={{ color: "#E8360A" }}>Deserves</span>&nbsp;Its Worth
          </h1>
          <p className="text-[#4A2E1A] text-base mb-8 max-w-md leading-relaxed font-medium">
            Scan bills. Rate dishes. Find restaurants that give you the most bang for your buck — verified by India's food community.
          </p>

          {/* Stats band */}
          <div className="flex gap-6 mb-8">
            {[
              { val: "24K+", lbl: "Bills Scanned" },
              { val: "4.6★", lbl: "Avg Rating" },
              { val: "₹8L+", lbl: "Saved by Users" },
            ].map((s) => (
              <div key={s.lbl}>
                <div className="font-display text-2xl font-black text-[#E8360A]">{s.val}</div>
                <div className="text-[#8C6A52] text-xs font-semibold">{s.lbl}</div>
              </div>
            ))}
          </div>

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

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mt-8 stagger">
        {[
          { label: "Bills Scanned", value: "24", icon: <Receipt size={22} />, color: "#E8360A", bg: "#FDE8D0" },
          { label: "Avg Rating", value: "4.3★", icon: <Star size={22} className="fill-current" />, color: "#FF9F1C", bg: "#FDE8D0" },
          { label: "Money Saved", value: "₹1,240", icon: <TrendingUp size={22} />, color: "#16a34a", bg: "#DCFCE7" },
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

      {/* ── Cuisine Chips ────────────────────────────────────── */}
      <div className="mt-10 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {cuisines.map((c, i) => (
          <button
            key={c}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap"
            style={i === 0
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
          sub="Restaurants closest to you, sorted by Worth-It score"
          action={
            <button onClick={() => navigate("/explore")} className="text-[#E8360A] text-xs font-bold tracking-wider uppercase hover:opacity-70 transition-opacity flex items-center gap-1">
              View all <span>→</span>
            </button>
          }
        >
          🔥 Top Nearby
        </SectionHead>

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
              <div className="h-32 flex items-center justify-center text-6xl relative" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                <span className="float-emoji">{r.image_url || "🍽️"}</span>
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
                  <span className="text-[#E8360A] font-black text-xs">₹{r.avg_cost ?? r.price_for_two} for 2</span>
                  <ScorePill score={r.worth_it_score ?? 75} />
                </div>
              </div>
            </div>
          ))}
        </div>
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
              <div key={idx} className="card-warm p-4 flex items-center gap-4 cursor-default">
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

      {/* ── Wallet Dashboard ─────────────────────────────────── */}
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
              Track your dining expenses, visualise your spending habits, and discover how much you've saved with Budget Bit's smart recommendations.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Receipt size={18} />, title: "Bill Tracking", sub: "Auto-extract details from photos" },
                { icon: <TrendingUp size={18} />, title: "Spending Insights", sub: "Visualize monthly trends" },
                { icon: <Heart size={18} />, title: "Smart Savings", sub: "Find budget-friendly alternatives" },
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
              Start Saving Now →
            </button>
          </div>

          {/* Right: dashboard card mockup */}
          <div className="relative">
            <div className="card-warm p-6 relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-[#1A0A00] text-base">My Dining Profile</p>
                  <p className="text-[#8C6A52] text-xs mt-0.5">Monthly Overview · March 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}>
                    <p className="text-[9px] opacity-80 uppercase tracking-wider">Top Saver</p>
                    <p>Top 5%</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs" style={{ background: "#E8360A" }}>JD</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                  <p className="text-[#8C6A52] text-[10px] font-bold uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="font-display font-black text-xl text-[#1A0A00]">₹12,450</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                  <p className="text-[#8C6A52] text-[10px] font-bold uppercase tracking-wider mb-1">Bills Uploaded</p>
                  <p className="font-display font-black text-xl text-[#1A0A00]">8 <span className="text-sm font-sans text-[#8C6A52] font-normal">receipts</span></p>
                </div>
              </div>

              <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(22,163,74,0.08),rgba(22,163,74,0.03))", border: "1.5px solid rgba(22,163,74,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-green-600" />
                  <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">Money Saved</p>
                </div>
                <p className="font-display font-black text-3xl text-[#1A0A00] mb-1">₹3,420</p>
                <p className="text-[#8C6A52] text-xs">You saved 22% this month by choosing Budget Bit recommendations.</p>
                <button className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1 hover:opacity-70">View Details →</button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#1A0A00] font-bold text-xs">Spending Trends</p>
                  <span className="text-[#8C6A52] text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#FDE8D0" }}>Last 6 Months</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {[65, 90, 55, 100, 70, 85].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg bar-fill transition-all" style={{ height: `${h}%`, background: i === 3 ? "linear-gradient(to top,#E8360A,#FF9F1C)" : "#FDE8D0" }} />
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m) => (
                    <p key={m} className="flex-1 text-center text-[9px] text-[#8C6A52] font-medium">{m}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <p className="text-[#E8360A] font-bold text-xs uppercase tracking-widest mb-3">❤️ Community Love</p>
          <h2 className="font-display text-5xl font-black text-[#1A0A00] leading-tight">
            Voices of the <span style={{ color: "#E8360A" }}>Community</span>
          </h2>
          <p className="text-[#8C6A52] text-sm mt-3 max-w-md mx-auto font-medium">
            Discover how Budget Bit is helping food lovers across India eat better for less.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {[
            { stars: 5, quote: "Budget Bit helped me find hidden gems in Mumbai without overspending! The recommendations are always spot on.", name: "Aisha K.", role: "Food Enthusiast", topFind: "Spice Route", emoji: "👩🏽" },
            { stars: 5, quote: "Easy bill upload and honest reviews make dining out stress-free. I love seeing exactly what I'm paying for.", name: "Ravi S.", role: "Frequent Diner", topFind: "Thali King", emoji: "👨🏽" },
            { stars: 4, quote: "The 'Worth-It' score is a game changer. I finally know where to get the best quantity for my money.", name: "Priya M.", role: "Student", topFind: "Chaat Corner", emoji: "👩🏻" },
            { stars: 5, quote: "Finally a way to track my food spending while discovering amazing local spots. The community is so helpful!", name: "Arjun D.", role: "Food Blogger", topFind: "Burger Point", emoji: "👨🏾" },
            { stars: 5, quote: "I love the community vibes. Real reviews from real people, not just paid influencers. Highly recommended!", name: "Sara L.", role: "Chef", topFind: "Dosa Plaza", emoji: "👩🏽" },
            { stars: 4, quote: "Found the best Thali place near my office thanks to the distance filter. Saves me time and money every day.", name: "Vikram R.", role: "Office Worker", topFind: "Curry House", emoji: "👨🏻" },
          ].map((t, i) => (
            <div key={i} className="card-warm p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-[80px] opacity-[0.07] select-none">{t.emoji}</div>
              <div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} className={s <= t.stars ? "text-[#FF9F1C] fill-[#FF9F1C]" : "text-[#F9C9A0] fill-[#F9C9A0]"} />
                  ))}
                </div>
                <p className="text-[#4A2E1A] text-sm leading-relaxed font-medium italic">"{t.quote}"</p>
              </div>
              <div className="mt-5 pt-5 border-t-2" style={{ borderColor: "rgba(232,54,10,0.07)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: "#FDE8D0" }}>
                    {t.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A0A00] text-sm leading-none">{t.name}</p>
                    <p className="text-[#8C6A52] text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-[#8C6A52] text-[10px]">Top Find:</span>
                  <span className="text-[#E8360A] font-bold text-[11px]">{t.topFind}</span>
                </div>
              </div>
            </div>
          ))}
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
          onClick={() => navigate("/upload")}
          className="relative z-10 bg-white text-[#E8360A] font-display font-black text-sm px-8 py-4 rounded-2xl flex-shrink-0 shadow-xl hover:scale-105 transition-transform"
        >
          Upload Bill →
        </button>
      </div>
    </div>
  );
}
