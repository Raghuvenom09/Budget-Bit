import { useState, useEffect, useRef } from "react";
import {
  Home, Upload, Compass, User, Search as SearchIcon, Camera,
  Image as ImageIcon, MapPin, Receipt, Star, FileText, CreditCard,
  ChevronLeft, LogOut, CheckCircle2, SlidersHorizontal, Settings,
  Trash2, TrendingUp, Zap, Flame, Award, Clock, Heart
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const restaurants = [
  {
    id: 1, name: "Spice Garden", cuisine: "North Indian", distance: 0.8,
    rating: 4.5, worthItScore: 87, priceForTwo: 600, image: "🍛",
    tag: "Trending", tagColor: "#E8360A",
    address: "12, MG Road, Bengaluru",
    googleRating: 4.4, socialBuzz: 82, communityReviews: 91,
    topDishes: [
      { name: "Butter Chicken", price: 280, score: 92, emoji: "🍗" },
      { name: "Dal Makhani",    price: 180, score: 88, emoji: "🍲" },
      { name: "Garlic Naan",    price: 60,  score: 85, emoji: "🫓" },
      { name: "Paneer Tikka",   price: 260, score: 83, emoji: "🧆" },
    ],
  },
  {
    id: 2, name: "Mumbai Tiffin House", cuisine: "Street Food", distance: 1.2,
    rating: 4.7, worthItScore: 93, priceForTwo: 300, image: "🥙",
    tag: "Best Value", tagColor: "#2EC4B6",
    address: "5, FC Road, Pune",
    googleRating: 4.6, socialBuzz: 95, communityReviews: 89,
    topDishes: [
      { name: "Vada Pav",  price: 30, score: 97, emoji: "🥪" },
      { name: "Pav Bhaji", price: 80, score: 94, emoji: "🍞" },
      { name: "Misal Pav", price: 90, score: 91, emoji: "🥘" },
      { name: "Bhel Puri", price: 50, score: 88, emoji: "🥗" },
    ],
  },
  {
    id: 3, name: "The Biryani Co.", cuisine: "Hyderabadi", distance: 2.1,
    rating: 4.3, worthItScore: 79, priceForTwo: 800, image: "🍚",
    tag: "Popular", tagColor: "#FF9F1C",
    address: "88, Banjara Hills, Hyderabad",
    googleRating: 4.2, socialBuzz: 76, communityReviews: 81,
    topDishes: [
      { name: "Chicken Biryani", price: 350, score: 85, emoji: "🍚" },
      { name: "Mutton Biryani",  price: 450, score: 82, emoji: "🥩" },
      { name: "Raita",           price: 50,  score: 70, emoji: "🥣" },
      { name: "Haleem",          price: 200, score: 78, emoji: "🍜" },
    ],
  },
  {
    id: 4, name: "South Spice Kitchen", cuisine: "South Indian", distance: 0.5,
    rating: 4.6, worthItScore: 90, priceForTwo: 400, image: "🥞",
    tag: "Editor's Pick", tagColor: "#a855f7",
    address: "3, Anna Nagar, Chennai",
    googleRating: 4.5, socialBuzz: 88, communityReviews: 93,
    topDishes: [
      { name: "Masala Dosa",   price: 80, score: 95, emoji: "🥞" },
      { name: "Idli Sambar",   price: 60, score: 92, emoji: "🍥" },
      { name: "Filter Coffee", price: 30, score: 96, emoji: "☕" },
      { name: "Medu Vada",     price: 50, score: 89, emoji: "🍩" },
    ],
  },
  {
    id: 5, name: "Chaat Corner", cuisine: "Chaat & Snacks", distance: 0.3,
    rating: 4.8, worthItScore: 95, priceForTwo: 200, image: "🥗",
    tag: "🔥 Hot",  tagColor: "#E8360A",
    address: "7, Connaught Place, Delhi",
    googleRating: 4.7, socialBuzz: 96, communityReviews: 94,
    topDishes: [
      { name: "Golgappa",    price: 40, score: 98, emoji: "🫙" },
      { name: "Dahi Bhalla", price: 60, score: 95, emoji: "🍦" },
      { name: "Aloo Tikki",  price: 50, score: 93, emoji: "🥔" },
      { name: "Raj Kachori", price: 70, score: 91, emoji: "🥗" },
    ],
  },
];

const topDishFeed = [
  { dish: "Masala Dosa",   restaurant: "South Spice Kitchen",  price: 80,  score: 95, emoji: "🥞", cuisine: "South Indian" },
  { dish: "Vada Pav",      restaurant: "Mumbai Tiffin House",  price: 30,  score: 97, emoji: "🥪", cuisine: "Street Food"  },
  { dish: "Butter Chicken",restaurant: "Spice Garden",         price: 280, score: 92, emoji: "🍗", cuisine: "North Indian" },
  { dish: "Golgappa",      restaurant: "Chaat Corner",         price: 40,  score: 98, emoji: "🫙", cuisine: "Chaat"        },
  { dish: "Chicken Biryani",restaurant:"The Biryani Co.",      price: 350, score: 85, emoji: "🍚", cuisine: "Hyderabadi"   },
  { dish: "Filter Coffee", restaurant: "South Spice Kitchen",  price: 30,  score: 96, emoji: "☕", cuisine: "South Indian" },
];

const pastBills = [
  { id: 1, restaurant: "Spice Garden",        date: "24 Feb 2026", amount: 680, dishes: ["Butter Chicken","Garlic Naan","Dal Makhani"],       avgRating: 4.2, saved: 120 },
  { id: 2, restaurant: "Mumbai Tiffin House", date: "19 Feb 2026", amount: 210, dishes: ["Vada Pav","Pav Bhaji","Bhel Puri"],                avgRating: 4.8, saved: 0   },
  { id: 3, restaurant: "The Biryani Co.",     date: "12 Feb 2026", amount: 900, dishes: ["Chicken Biryani","Mutton Biryani","Raita"],         avgRating: 3.9, saved: 250 },
  { id: 4, restaurant: "South Spice Kitchen", date: "5 Feb 2026",  amount: 350, dishes: ["Masala Dosa","Filter Coffee","Idli Sambar"],        avgRating: 4.9, saved: 0   },
];

const cuisines = ["All","North Indian","South Indian","Street Food","Hyderabadi","Chaat & Snacks","Chinese","Continental"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (s) => s >= 90 ? "#16a34a" : s >= 75 ? "#E8360A" : "#dc2626";
const scoreLabel = (s) => s >= 90 ? "Excellent" : s >= 75 ? "Good" : "Fair";
const scorePillBg= (s) => s >= 90
  ? "bg-green-100 text-green-700"
  : s >= 75
  ? "bg-orange-100 text-[#B52800]"
  : "bg-red-100 text-red-700";

// ─── Worth-It Ring Badge ──────────────────────────────────────────────────────
function WorthItBadge({ score, size = "md" }) {
  const dim    = size === "lg" ? 84 : size === "sm" ? 46 : 62;
  const r      = (dim / 2) - 5;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const sw     = size === "lg" ? 5 : 3.5;
  const color  = scoreColor(score);
  const fs     = size === "lg" ? "text-xl" : size === "sm" ? "text-[10px]" : "text-sm";

  return (
    <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="absolute inset-0 -rotate-90">
        <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={sw} />
        <circle
          cx={dim/2} cy={dim/2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-anim"
          style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center font-display font-black ${fs}`} style={{ color }}>
        <span className="leading-none">{score}</span>
        {size !== "sm" && <span className="text-[8px] font-sans font-semibold opacity-50 leading-none mt-0.5">/ 100</span>}
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={12} className={i <= Math.round(value) ? "text-[#FF9F1C] fill-[#FF9F1C]" : "text-[#F9C9A0] fill-[#F9C9A0]"} />
      ))}
    </div>
  );
}

function ScorePill({ score }) {
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${scorePillBg(score)}`}>
      {scoreLabel(score)}
    </span>
  );
}

// ─── Top Navigation ───────────────────────────────────────────────────────────
function NavBar({ active, setPage }) {
  const items = [
    { id: "home",    icon: <Home size={17} />,    label: "Home"        },
    { id: "upload",  icon: <Upload size={17} />,  label: "Upload Bill" },
    { id: "explore", icon: <Compass size={17} />, label: "Explore"     },
  ];
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: "rgba(255,248,240,0.88)", backdropFilter: "blur(20px)", borderColor: "rgba(232,54,10,0.10)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-black text-lg shadow-md"
            style={{ background: "linear-gradient(135deg, #E8360A, #FF9F1C)" }}
          >
            B
          </div>
          <span className="font-display font-black text-xl tracking-tight text-[#1A0A00]">
            Budget<span style={{ color: "#E8360A" }}>Bit</span>
          </span>
        </button>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all relative ${
                active === item.id
                  ? "text-[#E8360A] bg-[#E8360A]/8 nav-dot"
                  : "text-[#8C6A52] hover:text-[#1A0A00] hover:bg-[#FDE8D0]/60"
              }`}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setPage("profile")}
            className={`ml-2 pl-3 border-l flex items-center gap-2 text-sm font-semibold transition-all ${
              active === "profile" ? "text-[#E8360A]" : "text-[#8C6A52] hover:text-[#1A0A00]"
            }`}
            style={{ borderColor: "rgba(232,54,10,0.15)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border-2"
              style={{ background: "#FDE8D0", borderColor: active === "profile" ? "#E8360A" : "transparent" }}
            >
              <User size={16} style={{ color: "#E8360A" }} />
            </div>
            <span className="hidden sm:block">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHead({ children, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-7 relative">
      <div>
        <h2 className="font-display text-2xl font-black text-[#1A0A00] stripe-underline inline-block">
          {children}
        </h2>
        {sub && <p className="text-[#8C6A52] text-xs font-medium mt-2">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Snap Scan Score Animated Component ──────────────────────────────────────
const BILL_ITEMS = [
  { name: "Paneer Tikka", cat: "STARTER", price: "₹240", score: 91 },
  { name: "Butter Naan",  cat: "BREAD",   price: "₹60",  score: 88 },
  { name: "Jeera Rice",   cat: "MAIN",    price: "₹180", score: 84 },
];

function SnapScanScore({ setPage }) {
  // phases: idle → flash → scanning → extracting → scored → (loops)
  const [phase, setPhase]               = useState("idle");
  const [visibleItems, setVisibleItems] = useState([]);
  const [scoreVal, setScoreVal]         = useState(0);
  const [scanY, setScanY]               = useState(0);
  const timers   = useRef([]);
  const rafId    = useRef(null);
  const counterId= useRef(null);
  const sectionRef = useRef(null);
  const running  = useRef(false);

  // Clear all pending timers / animations
  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (rafId.current)    cancelAnimationFrame(rafId.current);
    if (counterId.current) clearInterval(counterId.current);
  }

  function t(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  }

  function runSequence() {
    // reset state
    setPhase("idle");
    setVisibleItems([]);
    setScoreVal(0);
    setScanY(0);

    t(() => setPhase("flash"),   600);
    t(() => { setPhase("scanning"); animateScan(); }, 1100);
    t(() => { setPhase("extracting"); setVisibleItems([0]); },  2600);
    t(() => setVisibleItems([0, 1]), 3200);
    t(() => setVisibleItems([0, 1, 2]), 3800);
    t(() => { setPhase("scored"); countUp(88); }, 4500);
    // pause on scored, then loop
    t(() => { runSequence(); }, 7200);
  }

  function animateScan() {
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setScanY(progress * 100);
      if (progress < 1) { rafId.current = requestAnimationFrame(step); }
    };
    rafId.current = requestAnimationFrame(step);
  }

  function countUp(target) {
    let v = 0;
    counterId.current = setInterval(() => {
      v += 3;
      if (v >= target) { setScoreVal(target); clearInterval(counterId.current); }
      else setScoreVal(v);
    }, 18);
  }

  // Start loop when visible, stop when hidden
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running.current) {
          running.current = true;
          runSequence();
        } else if (!entry.isIntersecting && running.current) {
          running.current = false;
          clearAll();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); clearAll(); };
  }, []);

  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (scoreVal / 100) * circ;

  return (
    <div ref={sectionRef} className="mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: animated phone ────────────────────────────── */}
        <div className="relative flex justify-center select-none">

          {/* Ambient glow that pulses when scored */}
          <div
            className="absolute inset-0 rounded-[60px] transition-all duration-700 pointer-events-none"
            style={{
              background: phase === "scored"
                ? "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(232,54,10,0.22) 0%, transparent 70%)"
                : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,54,10,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Phone shell */}
          <div
            className="relative w-72 rounded-[44px] overflow-hidden shadow-2xl border-4"
            style={{ background: "#0F0500", borderColor: "rgba(255,255,255,0.08)" }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <span className="text-[9px] text-white/40 font-bold tracking-widest">9:41</span>
              <div className="w-20 h-4 rounded-full" style={{ background: "#1a1a1a" }} />
              <span className="text-[9px] text-white/40 font-bold">●●●</span>
            </div>

            {/* Camera viewfinder area */}
            <div
              className="relative mx-4 rounded-2xl overflow-hidden"
              style={{
                height: 280,
                background: phase === "idle"
                  ? "#1A0800"
                  : "linear-gradient(160deg,#1A0800 0%,#0a0300 100%)",
                border: "1.5px solid rgba(232,54,10,0.15)",
                transition: "all 0.4s ease",
              }}
            >
              {/* Corner brackets (like a camera viewfinder) */}
              {[
                { top: 8, left: 8,   bdr: "borderTop borderLeft"   },
                { top: 8, right: 8,  bdr: "borderTop borderRight"  },
                { bottom: 8, left: 8, bdr: "borderBottom borderLeft" },
                { bottom: 8, right: 8,bdr: "borderBottom borderRight"},
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-6 pointer-events-none"
                  style={{
                    top: pos.top, bottom: pos.bottom,
                    left: pos.left, right: pos.right,
                    borderColor: "#E8360A",
                    borderTopWidth:    (i === 0 || i === 1) ? 2 : 0,
                    borderBottomWidth: (i === 2 || i === 3) ? 2 : 0,
                    borderLeftWidth:   (i === 0 || i === 2) ? 2 : 0,
                    borderRightWidth:  (i === 1 || i === 3) ? 2 : 0,
                    borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
                    transition: "opacity 0.5s",
                    opacity: phase === "idle" ? 0.4 : 1,
                  }}
                />
              ))}

              {/* Flash overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                style={{
                  background: "#ffffff",
                  opacity: phase === "flash" ? 0.85 : 0,
                  transition: phase === "flash" ? "opacity 0.08s" : "opacity 0.4s",
                }}
              />

              {/* Receipt paper (shows after flash) */}
              <div
                className="absolute inset-x-6 top-4 bottom-4 rounded-xl overflow-hidden shadow-xl"
                style={{
                  background: "#ffffff",
                  opacity: phase === "idle" || phase === "flash" ? 0 : 1,
                  transform: phase === "idle" || phase === "flash" ? "scale(0.9) translateY(10px)" : "scale(1) translateY(0)",
                  transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <div className="p-4">
                  <p className="font-display text-center text-[#1A0A00] font-black text-[11px] tracking-widest uppercase">Spice Garden</p>
                  <p className="text-center text-[#8C6A52] text-[8px] mb-2">Mumbai, India</p>
                  <div className="border-t border-dashed border-gray-200 my-1.5" />
                  {[
                    { name: "Paneer Tikka", price: "240.00" },
                    { name: "Butter Naan",  price: "60.00"  },
                    { name: "Jeera Rice",   price: "180.00" },
                  ].map((item, idx) => (
                    <div
                      key={item.name}
                      className="flex justify-between py-0.5"
                      style={{
                        opacity: visibleItems.includes(idx) ? 0.35 : 1,
                        transition: "opacity 0.3s",
                        background: visibleItems.includes(idx) ? "rgba(22,163,74,0.04)" : "transparent",
                      }}
                    >
                      <span className="text-[9px] text-[#4A2E1A] font-medium">{item.name}</span>
                      <span className="text-[9px] text-[#4A2E1A] font-bold">{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 my-1.5" />
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-[#1A0A00]">Total</span>
                    <span className="text-[10px] font-black text-[#1A0A00]">480.00</span>
                  </div>
                </div>
              </div>

              {/* Scan beam */}
              {phase === "scanning" && (
                <div
                  className="absolute inset-x-6 z-10 pointer-events-none"
                  style={{
                    top: `calc(16px + ${scanY * 2.3}px)`,
                    height: 3,
                    background: "linear-gradient(90deg, transparent, #E8360A, #FF9F1C, #E8360A, transparent)",
                    boxShadow: "0 0 16px 4px rgba(232,54,10,0.55)",
                    transition: "top 0.05s linear",
                    borderRadius: 2,
                  }}
                />
              )}

              {/* Score ring overlay (post-scan) */}
              {phase === "scored" && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 pointer-events-none z-30">
                  <div className="relative">
                    <svg width={90} height={90} className="-rotate-90">
                      <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} />
                      <circle
                        cx={45} cy={45} r={r} fill="none"
                        stroke="url(#scoreGrad)" strokeWidth={5} strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.04s linear", filter: "drop-shadow(0 0 6px #E8360A)" }}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#E8360A" />
                          <stop offset="100%" stopColor="#FF9F1C" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-black text-white text-2xl leading-none">{scoreVal}</span>
                      <span className="text-white/50 text-[8px] font-bold">SCORE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Idle: camera icon */}
              {phase === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Camera size={36} style={{ color: "rgba(232,54,10,0.4)" }} />
                  <p className="text-[#8C6A52] text-[10px] font-bold">Point at your bill</p>
                </div>
              )}
            </div>

            {/* Bottom bar: shutter button area */}
            <div className="flex items-center justify-center gap-6 py-5">
              <div className="w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
              {/* Shutter */}
              <button
                className="w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all"
                style={{
                  background: phase === "scored"
                    ? "linear-gradient(135deg,#E8360A,#FF9F1C)"
                    : "rgba(255,255,255,0.12)",
                  borderColor: phase === "scored" ? "#FF9F1C" : "rgba(255,255,255,0.2)",
                  boxShadow: phase === "scored" ? "0 0 20px rgba(232,54,10,0.5)" : "none",
                  transition: "all 0.4s ease",
                }}
              >
                <Camera size={22} style={{ color: phase === "scored" ? "#fff" : "rgba(255,255,255,0.6)" }} />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }} />
              </div>
            </div>

            {/* Status label */}
            <div className="px-4 pb-5 text-center">
              <p
                className="text-xs font-bold transition-all duration-300"
                style={{ color: phase === "scored" ? "#FF9F1C" : "rgba(255,255,255,0.35)" }}
              >
                {phase === "idle"       && "Tap shutter to demo ↑"}
                {phase === "flash"      && "📸 Capturing..."}
                {phase === "scanning"   && "🔍 Scanning receipt..."}
                {phase === "extracting" && "⚡ Extracting items..."}
                {phase === "scored"     && "✅ Worth-It Score Ready!"}
              </p>
            </div>
          </div>

          {/* Floating badge: NO MANUAL ENTRY */}
          <div
            className="absolute -right-6 top-24 bg-[#E8360A] text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl rotate-[8deg] z-20"
            style={{
              opacity: (phase === "extracting" || phase === "scored") ? 1 : 0,
              transform: (phase === "extracting" || phase === "scored")
                ? "rotate(8deg) scale(1)"
                : "rotate(8deg) scale(0.6)",
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            NO MANUAL<br />ENTRY! 🎉
          </div>
        </div>

        {/* ── RIGHT: copy + live extracted list ───────────────── */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest border-2" style={{ background: "#FDE8D0", color: "#E8360A", borderColor: "rgba(232,54,10,0.2)" }}>
            <Zap size={12} className="fill-[#E8360A]" /> AI-Powered Extraction
          </div>
          <h2 className="font-display text-5xl font-black text-[#1A0A00] leading-[1.05] mb-5">
            Snap, Scan,<br />
            <span style={{ color: "#E8360A" }}>and Score.</span>
          </h2>
          <p className="text-[#4A2E1A] text-base font-medium mb-8 max-w-md leading-relaxed">
            Forget typing. Just snap a photo of your bill, and Budget Bit instantly digitises your dining experience — with AI accuracy.
          </p>

          {/* Live extraction list */}
          <div className="space-y-3 mb-8">
            {BILL_ITEMS.map((item, idx) => (
              <div
                key={item.name}
                className="card-warm p-4 flex items-center gap-4 border-2"
                style={{
                  opacity: visibleItems.includes(idx) ? 1 : 0.2,
                  transform: visibleItems.includes(idx) ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.05}s`,
                  borderColor: visibleItems.includes(idx) ? "rgba(22,163,74,0.25)" : "rgba(232,54,10,0.07)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{
                    background: visibleItems.includes(idx) ? "#DCFCE7" : "#FDE8D0",
                    transform: visibleItems.includes(idx) ? "scale(1)" : "scale(0.7)",
                  }}
                >
                  {visibleItems.includes(idx)
                    ? <CheckCircle2 size={18} className="text-green-600" />
                    : <div className="w-3 h-3 rounded-full" style={{ background: "#F9C9A0" }} />
                  }
                </div>
                <div className="flex-1">
                  <p
                    className="font-bold text-sm transition-all duration-300"
                    style={{ color: visibleItems.includes(idx) ? "#1A0A00" : "#C4A090" }}
                  >
                    {item.name}
                  </p>
                  <p className="text-[#8C6A52] text-[10px] font-bold tracking-widest uppercase mt-0.5">{item.cat}</p>
                </div>
                <div className="text-right">
                  <p
                    className="font-black text-sm transition-all duration-300"
                    style={{ color: visibleItems.includes(idx) ? "#E8360A" : "#C4A090" }}
                  >
                    {item.price}
                  </p>
                  <p
                    className="text-[9px] mt-0.5 font-semibold transition-all"
                    style={{ color: visibleItems.includes(idx) ? "#8C6A52" : "#D4B8A8" }}
                  >
                    {visibleItems.includes(idx) ? "✓ Extracted" : "Pending..."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Score badge — appears at end */}
          <div
            className="flex items-center gap-4 card-warm p-4 border-2 mb-6"
            style={{
              borderColor: "rgba(232,54,10,0.2)",
              opacity: phase === "scored" ? 1 : 0,
              transform: phase === "scored" ? "scale(1)" : "scale(0.9)",
              transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <WorthItBadge score={scoreVal} size="md" />
            <div>
              <p className="font-bold text-[#1A0A00] text-sm">Worth-It Score Calculated!</p>
              <p className="text-[#8C6A52] text-xs mt-0.5">Based on price, portion &amp; community ratings</p>
            </div>
            <span className="ml-auto px-3 py-1.5 rounded-full text-[10px] font-black text-green-700 uppercase tracking-wider" style={{ background: "#DCFCE7" }}>
              Good Value
            </span>
          </div>

          <button
            onClick={() => setPage("upload")}
            className="px-8 py-4 rounded-2xl font-bold text-white text-sm shadow-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
          >
            Try It With Your Bill →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage, setSelectedRestaurant }) {
  const [search, setSearch] = useState("");
  const filtered = topDishFeed.filter(
    (d) =>
      d.dish.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-16 w-full">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="hero-food rounded-3xl mt-6 px-10 py-14 relative overflow-hidden border-2" style={{ borderColor: "rgba(232,54,10,0.10)" }}>
        {/* Floating emojis */}
        <div className="absolute right-16 top-8 text-6xl float-emoji select-none" style={{ animationDelay: "0s" }}>🍛</div>
        <div className="absolute right-36 bottom-6 text-4xl float-emoji select-none" style={{ animationDelay: "1.2s" }}>🌶️</div>
        <div className="absolute right-6 bottom-12 text-5xl float-emoji select-none" style={{ animationDelay: "0.6s" }}>🍽️</div>

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#E8360A]/10 border border-[#E8360A]/20 text-[#E8360A] text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Flame size={13} className="fill-[#E8360A]" /> Good afternoon, Rahul 👋
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
              { val: "4.6★", lbl: "Avg Rating"    },
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
          { label: "Bills Scanned",  value: "24",     icon: <Receipt size={22} />,                             color: "#E8360A", bg: "#FDE8D0" },
          { label: "Avg Rating",     value: "4.3★",   icon: <Star size={22} className="fill-current" />,       color: "#FF9F1C", bg: "#FDE8D0" },
          { label: "Money Saved",    value: "₹1,240", icon: <TrendingUp size={22} />,                          color: "#16a34a", bg: "#DCFCE7" },
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
            <button onClick={() => setPage("explore")} className="text-[#E8360A] text-xs font-bold tracking-wider uppercase hover:opacity-70 transition-opacity flex items-center gap-1">
              View all <span>→</span>
            </button>
          }
        >
          🔥 Top Nearby
        </SectionHead>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {restaurants.slice(0, 4).map((r) => (
            <div
              key={r.id}
              onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
              className="card-warm cursor-pointer overflow-hidden"
            >
              {/* Emoji banner */}
              <div className="h-32 flex items-center justify-center text-6xl relative" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                <span className="float-emoji">{r.image}</span>
                {/* Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide" style={{ background: r.tagColor }}>
                  {r.tag}
                </div>
                <div className="absolute top-2 right-2">
                  <WorthItBadge score={r.worthItScore} size="sm" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A0A00] text-sm leading-tight truncate">{r.name}</h3>
                <p className="text-[#8C6A52] text-[11px] mt-1 flex items-center gap-1">
                  <MapPin size={9} /> {r.cuisine} · {r.distance} km
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#E8360A] font-black text-xs">₹{r.priceForTwo} for 2</span>
                  <ScorePill score={r.worthItScore} />
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
      <SnapScanScore setPage={setPage} />

      {/* ── Wallet Dashboard ─────────────────────────────────── */}
      <div className="mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
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
                { icon: <Receipt size={18} />, title: "Bill Tracking",     sub: "Auto-extract details from photos" },
                { icon: <TrendingUp size={18} />, title: "Spending Insights", sub: "Visualize monthly trends"       },
                { icon: <Heart size={18} />,    title: "Smart Savings",    sub: "Find budget-friendly alternatives" },
                { icon: <Clock size={18} />,    title: "Dining History",   sub: "Keep a log of every meal"         },
              ].map((f) => (
                <div key={f.title} className="card-warm p-4">
                  <div className="mb-2 text-[#E8360A]">{f.icon}</div>
                  <p className="font-bold text-[#1A0A00] text-xs leading-tight">{f.title}</p>
                  <p className="text-[#8C6A52] text-[10px] mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("upload")}
              className="px-8 py-4 rounded-2xl font-bold text-white text-sm shadow-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              Start Saving Now →
            </button>
          </div>

          {/* Right: dashboard card mockup */}
          <div className="relative">
            <div className="card-warm p-6 relative overflow-hidden">
              {/* Top badges */}
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

              {/* Stats row */}
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

              {/* Savings highlight */}
              <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(22,163,74,0.08),rgba(22,163,74,0.03))", border: "1.5px solid rgba(22,163,74,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-green-600" />
                  <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">Money Saved</p>
                </div>
                <p className="font-display font-black text-3xl text-[#1A0A00] mb-1">₹3,420</p>
                <p className="text-[#8C6A52] text-xs">You saved 22% this month by choosing Budget Bit recommendations.</p>
                <button className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1 hover:opacity-70">View Details →</button>
              </div>

              {/* Mini bar chart */}
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
                  {["Oct","Nov","Dec","Jan","Feb","Mar"].map((m) => (
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
            { stars: 5, quote: "Easy bill upload and honest reviews make dining out stress-free. I love seeing exactly what I'm paying for.", name: "Ravi S.",  role: "Frequent Diner",  topFind: "Thali King",  emoji: "👨🏽" },
            { stars: 4, quote: "The 'Worth-It' score is a game changer. I finally know where to get the best quantity for my money.", name: "Priya M.", role: "Student",          topFind: "Chaat Corner", emoji: "👩🏻" },
            { stars: 5, quote: "Finally a way to track my food spending while discovering amazing local spots. The community is so helpful!", name: "Arjun D.", role: "Food Blogger",    topFind: "Burger Point", emoji: "👨🏾" },
            { stars: 5, quote: "I love the community vibes. Real reviews from real people, not just paid influencers. Highly recommended!", name: "Sara L.",  role: "Chef",            topFind: "Dosa Plaza",   emoji: "👩🏽" },
            { stars: 4, quote: "Found the best Thali place near my office thanks to the distance filter. Saves me time and money every day.", name: "Vikram R.", role: "Office Worker",  topFind: "Curry House",  emoji: "👨🏻" },
          ].map((t, i) => (
            <div key={i} className="card-warm p-6 flex flex-col justify-between relative overflow-hidden">
              {/* Watermark emoji */}
              <div className="absolute -right-4 -top-4 text-[80px] opacity-[0.07] select-none">{t.emoji}</div>
              <div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
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
          onClick={() => setPage("upload")}
          className="relative z-10 bg-white text-[#E8360A] font-display font-black text-sm px-8 py-4 rounded-2xl flex-shrink-0 shadow-xl hover:scale-105 transition-transform"
        >
          Upload Bill →
        </button>
      </div>
    </div>
  );
}

// ─── Upload Bill ──────────────────────────────────────────────────────────────
function UploadPage({ setPage, setExtractedDishes }) {
  const [stage, setStage]     = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const mockExtracted = [
    { name: "Butter Chicken", price: 280 },
    { name: "Garlic Naan",    price: 60  },
    { name: "Dal Makhani",    price: 180 },
    { name: "Lassi",          price: 80  },
  ];
  const [dishes, setDishes] = useState(mockExtracted);
  const handleUpload = () => { setStage("preview"); setTimeout(() => setStage("extracted"), 1300); };
  const updateDish   = (idx, field, val) => setDishes((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d));
  const removeDish   = (idx) => setDishes((prev) => prev.filter((_, i) => i !== idx));
  const handleRate   = () => { setExtractedDishes(dishes); setPage("rate"); };

  return (
    <div className="pb-16 w-full max-w-4xl mx-auto">
      {/* Hero */}
      <div
        className="rounded-3xl mt-6 px-10 py-12 relative overflow-hidden border-2"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)", borderColor: "transparent" }}
      >
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none">🧾</div>
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          <Zap size={12} className="fill-white" /> Smart Bill Scanner
        </div>
        <h1 className="font-display text-4xl font-black text-white mb-2">Upload Your Bill</h1>
        <p className="text-white/75 text-sm font-medium">We extract every item — you rate, we calculate your Worth-It score.</p>
      </div>

      <div className="mt-8">
        {stage === "idle" && (
          <div className="stagger">
            {/* Drop zone */}
            <div
              onClick={handleUpload}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
              className={`rounded-3xl border-2 border-dashed flex flex-col items-center justify-center py-20 cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-[#E8360A] bg-[#E8360A]/5"
                  : "border-[#E8360A]/25 bg-[#FFF8F0] hover:border-[#E8360A]/50 hover:bg-[#FDE8D0]/40"
              }`}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg wiggle"
                style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
              >
                <Camera size={36} className="text-white" />
              </div>
              <p className="text-[#1A0A00] font-bold text-lg">Drop your bill here or click to upload</p>
              <p className="text-[#8C6A52] text-sm mt-1.5">Supports JPG, PNG, PDF · Max 10MB</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpload}
                className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all active:scale-[0.98] hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
              >
                <Camera size={18} /> Take Photo
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-[#FDE8D0] active:scale-[0.98] border-2"
                style={{ background: "#ffffff", color: "#E8360A", borderColor: "rgba(232,54,10,0.2)" }}
              >
                <ImageIcon size={18} /> Gallery
              </button>
            </div>

            {/* Recent Bills */}
            <div className="mt-10">
              <SectionHead>Recent Bills</SectionHead>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pastBills.slice(0, 2).map((b) => (
                  <div key={b.id} className="card-warm p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FDE8D0", color: "#E8360A" }}>
                      <Receipt size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1A0A00] text-sm truncate">{b.restaurant}</p>
                      <p className="text-[#8C6A52] text-xs mt-0.5 flex items-center gap-1"><Clock size={9} /> {b.date}</p>
                    </div>
                    <span className="text-[#E8360A] font-black text-sm">₹{b.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === "preview" && (
          <div className="flex flex-col items-center py-20 card-warm">
            <div className="relative mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-pulse"
                style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
              >
                <Receipt size={36} className="text-white" />
              </div>
            </div>
            <p className="text-[#1A0A00] font-bold text-lg mb-1">Reading your bill…</p>
            <p className="text-[#8C6A52] text-sm mb-6">Extracting dishes &amp; prices with AI</p>
            <div className="flex gap-2">
              {[0,1,2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full boop"
                  style={{ background: "#E8360A", animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {stage === "extracted" && (
          <div className="stagger">
            {/* Success */}
            <div className="card-warm p-5 flex items-center gap-4 mb-6 border-2" style={{ borderColor: "rgba(22,163,74,0.2)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#DCFCE7" }}>
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-[#1A0A00] font-bold text-sm">Bill extracted successfully!</p>
                <p className="text-[#8C6A52] text-xs mt-0.5">Spice Garden · 24 Feb 2026 · 8:32 PM</p>
              </div>
              <span className="text-green-600 text-xs font-black uppercase tracking-wider">✓ Done</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A0A00] text-base">{dishes.length} items found</h3>
              <button
                onClick={() => setDishes([...dishes, { name: "New Item", price: 0 }])}
                className="text-[#E8360A] text-xs font-bold px-3 py-1.5 rounded-full transition-colors hover:bg-[#FDE8D0]"
                style={{ background: "rgba(232,54,10,0.08)" }}
              >+ Add Item</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {dishes.map((d, idx) => (
                <div key={idx} className="card-warm p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <input
                      value={d.name}
                      onChange={(e) => updateDish(idx, "name", e.target.value)}
                      className="w-full font-bold text-[#1A0A00] text-sm bg-transparent focus:outline-none border-b-2 border-transparent focus:border-[#E8360A]/40 transition-colors pb-0.5"
                    />
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[#8C6A52] text-xs">₹</span>
                      <input
                        type="number"
                        value={d.price}
                        onChange={(e) => updateDish(idx, "price", Number(e.target.value))}
                        className="text-[#E8360A] font-black text-sm bg-transparent focus:outline-none w-20"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeDish(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#F9C9A0] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="rounded-2xl p-5 flex items-center justify-between mb-6 border-2"
              style={{ background: "#FDE8D0", borderColor: "rgba(232,54,10,0.15)" }}
            >
              <span className="text-[#4A2E1A] font-bold text-sm">Total Amount</span>
              <span className="font-display font-black text-2xl text-[#E8360A]">₹{dishes.reduce((a, d) => a + d.price, 0)}</span>
            </div>

            <button
              onClick={handleRate}
              className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              Rate Your Meal <Star fill="currentColor" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Rate Meal ────────────────────────────────────────────────────────────────
function RatePage({ extractedDishes, setPage }) {
  const dishes = extractedDishes?.length ? extractedDishes : [
    { name: "Butter Chicken", price: 280 },
    { name: "Garlic Naan",    price: 60  },
    { name: "Dal Makhani",    price: 180 },
  ];
  const [ratings, setRatings] = useState(dishes.map(() => ({ taste: 3, value: 3, portion: 3 })));
  const [submitted, setSubmitted] = useState(false);
  const update = (dIdx, key, val) => setRatings((prev) => prev.map((r, i) => i === dIdx ? { ...r, [key]: val } : r));
  const overallScore = Math.round(
    ratings.reduce((acc, r) => acc + (r.taste + r.value + r.portion) / 3, 0) / ratings.length * 20
  );

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
        <div className="text-8xl mb-6 float-emoji">🎉</div>
        <WorthItBadge score={overallScore} size="lg" />
        <h2 className="font-display text-4xl font-black text-[#1A0A00] mt-6 mb-2">Review Submitted!</h2>
        <p className="text-[#8C6A52] text-sm text-center mb-10 max-w-xs font-medium">
          Your ratings sharpen the Worth-It scores for the whole community.
        </p>
        <button
          onClick={() => setPage("home")}
          className="px-10 py-4 rounded-2xl font-bold text-white shadow-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
        >
          <Home size={18} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16 w-full max-w-4xl mx-auto">
      <div
        className="rounded-3xl mt-6 px-10 py-12 relative overflow-hidden border-2 mb-8"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)", borderColor: "transparent" }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-10 select-none">⭐</div>
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          Step 2 of 2
        </div>
        <h1 className="font-display text-4xl font-black text-white mb-2">Rate Your Meal</h1>
        <p className="text-white/75 text-sm font-medium">Score each dish on taste, value &amp; portion size.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger">
        {dishes.map((dish, dIdx) => (
          <div key={dIdx} className="card-warm p-6">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b-2" style={{ borderColor: "rgba(232,54,10,0.07)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>🍽️</div>
              <div>
                <h3 className="font-bold text-[#1A0A00] text-base">{dish.name}</h3>
                <p className="text-[#E8360A] font-black text-sm mt-0.5">₹{dish.price}</p>
              </div>
            </div>
            {[
              { key: "taste",   label: "Taste",           emoji: "😋" },
              { key: "value",   label: "Value for Money",  emoji: "💸" },
              { key: "portion", label: "Portion Size",     emoji: "🥘" },
            ].map(({ key, label, emoji }) => (
              <div key={key} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[#4A2E1A] text-sm font-semibold flex items-center gap-1.5">{emoji} {label}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        onClick={() => update(dIdx, key, star)}
                        className={`transition-transform active:scale-125 ${star <= ratings[dIdx][key] ? "text-[#FF9F1C]" : "text-[#F9C9A0]"}`}
                      >
                        <Star size={18} fill={star <= ratings[dIdx][key] ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range" min="1" max="5" step="1"
                  value={ratings[dIdx][key]}
                  onChange={(e) => update(dIdx, key, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8360A ${(ratings[dIdx][key]-1)*25}%, #FDE8D0 ${(ratings[dIdx][key]-1)*25}%)` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Live score */}
      <div className="card-warm p-6 flex items-center justify-between mt-6 border-2" style={{ borderColor: "rgba(232,54,10,0.12)" }}>
        <div>
          <p className="font-bold text-[#1A0A00] text-base">Live Worth-It Score</p>
          <p className="text-[#8C6A52] text-xs mt-1 font-medium">Updates live as you rate each dish</p>
        </div>
        <WorthItBadge score={overallScore} size="lg" />
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full mt-5 py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
      >
        Submit Review <CheckCircle2 size={20} />
      </button>
    </div>
  );
}

// ─── Restaurant Page ──────────────────────────────────────────────────────────
function RestaurantPage({ restaurant, setPage }) {
  const r = restaurant || restaurants[0];
  const breakdown = [
    { label: "Google Rating",     value: r.googleRating * 20, raw: `${r.googleRating}/5`,     color: "#FF9F1C" },
    { label: "Social Buzz",       value: r.socialBuzz,        raw: `${r.socialBuzz}/100`,      color: "#3b82f6" },
    { label: "Community Reviews", value: r.communityReviews,  raw: `${r.communityReviews}/100`,color: "#16a34a" },
  ];

  return (
    <div className="pb-16 w-full">
      {/* Hero image-like banner */}
      <div className="relative rounded-3xl mt-6 overflow-hidden" style={{ height: 300, background: "linear-gradient(135deg,#FDE8D0,#FFF0D0,#FFF8E0)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-[180px] opacity-30 select-none">
          {r.image}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,248,240,0.98) 0%, rgba(255,248,240,0.3) 55%, transparent 100%)" }} />
        {/* Back button */}
        <button
          onClick={() => setPage("explore")}
          className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors hover:bg-[#FDE8D0]"
          style={{ background: "#ffffff", border: "1.5px solid rgba(232,54,10,0.15)" }}
        >
          <ChevronLeft size={22} style={{ color: "#E8360A" }} />
        </button>
        {/* Tag */}
        <div
          className="absolute top-6 right-6 px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-wide"
          style={{ background: r.tagColor || "#E8360A" }}
        >
          {r.tag}
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-black text-[#1A0A00] leading-tight">{r.name}</h1>
            <p className="text-[#8C6A52] text-sm mt-1 flex items-center gap-1.5">
              <MapPin size={13} style={{ color: "#E8360A" }} /> {r.address}
            </p>
          </div>
          <WorthItBadge score={r.worthItScore} size="lg" />
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex items-center flex-wrap gap-4 mt-5 px-1">
        <div className="flex items-center gap-1.5">
          <StarRating value={r.rating} />
          <span className="text-[#4A2E1A] text-xs font-bold ml-1">{r.rating}</span>
        </div>
        <span className="w-px h-4" style={{ background: "rgba(232,54,10,0.15)" }} />
        <span className="text-[#8C6A52] text-xs font-semibold">{r.cuisine}</span>
        <span className="w-px h-4" style={{ background: "rgba(232,54,10,0.15)" }} />
        <span className="text-[#8C6A52] text-xs flex items-center gap-1"><MapPin size={10} />{r.distance} km away</span>
        <span className="w-px h-4" style={{ background: "rgba(232,54,10,0.15)" }} />
        <span className="text-[#E8360A] font-black text-xs">₹{r.priceForTwo} for two</span>
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Breakdown */}
        <div className="lg:col-span-1">
          <div className="card-warm p-6">
            <h2 className="font-bold text-[#1A0A00] text-sm mb-6 flex items-center gap-2">
              <SlidersHorizontal size={16} style={{ color: "#E8360A" }} /> Score Breakdown
            </h2>
            <div className="space-y-5">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#8C6A52] text-xs font-semibold">{b.label}</span>
                    <span className="font-black text-xs" style={{ color: b.color }}>{b.raw}</span>
                  </div>
                  <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "#FDE8D0" }}>
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{ width: `${b.value}%`, background: b.color, boxShadow: `0 0 6px ${b.color}60` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t-2 flex items-center gap-4" style={{ borderColor: "rgba(232,54,10,0.08)" }}>
              <WorthItBadge score={r.worthItScore} size="md" />
              <div>
                <p className="text-[#1A0A00] font-bold text-sm">Overall Score</p>
                <ScorePill score={r.worthItScore} />
              </div>
            </div>
          </div>
        </div>

        {/* Dishes */}
        <div className="lg:col-span-2">
          <SectionHead>🍽️ Top Dishes</SectionHead>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {r.topDishes.map((d, i) => (
              <div key={i} className="card-warm p-4 flex items-center gap-4">
                <div
                  className="text-3xl w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}
                >
                  {d.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A0A00] text-sm truncate">{d.name}</p>
                  <p className="text-[#E8360A] font-black text-xs mt-0.5">₹{d.price}</p>
                  <div className="mt-1.5"><ScorePill score={d.score} /></div>
                </div>
                <WorthItBadge score={d.score} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Explore Page ─────────────────────────────────────────────────────────────
function ExplorePage({ setPage, setSelectedRestaurant }) {
  const [budget, setBudget]             = useState(2000);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [maxDist, setMaxDist]           = useState(5);

  const filtered = restaurants.filter(
    (r) => r.priceForTwo <= budget &&
      (selectedCuisine === "All" || r.cuisine === selectedCuisine) &&
      r.distance <= maxDist
  );

  return (
    <div className="pb-16 w-full">
      {/* Header */}
      <div
        className="rounded-3xl mt-6 px-10 py-12 relative overflow-hidden border-2 mb-8"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)", borderColor: "transparent" }}
      >
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none float-emoji">🗺️</div>
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          <Compass size={12} /> Discover
        </div>
        <h1 className="font-display text-4xl font-black text-white mb-2">Explore Restaurants</h1>
        <p className="text-white/75 text-sm font-medium">Filter by budget, distance &amp; cuisine type.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="card-warm p-6 sticky top-24">
            <h3 className="text-[#1A0A00] font-bold text-sm mb-6 flex items-center gap-2">
              <SlidersHorizontal size={16} style={{ color: "#E8360A" }} /> Filters
            </h3>

            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider">💰 Budget for Two</span>
                <span className="font-display font-black text-sm text-[#E8360A]">₹{budget}</span>
              </div>
              <input
                type="range" min="100" max="2000" step="50" value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: "#E8360A" }}
              />
              <div className="flex justify-between text-[10px] text-[#8C6A52] mt-1 font-semibold">
                <span>₹100</span><span>₹2000</span>
              </div>
            </div>

            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider">📍 Distance</span>
                <span className="font-display font-black text-sm text-[#E8360A]">{maxDist} km</span>
              </div>
              <input
                type="range" min="0.5" max="10" step="0.5" value={maxDist}
                onChange={(e) => setMaxDist(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: "#E8360A" }}
              />
              <div className="flex justify-between text-[10px] text-[#8C6A52] mt-1 font-semibold">
                <span>0.5 km</span><span>10 km</span>
              </div>
            </div>

            <div>
              <p className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider mb-3">🍽️ Cuisine</p>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCuisine(c)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={selectedCuisine === c
                      ? { background: "linear-gradient(135deg,#E8360A,#FF9F1C)", color: "#fff" }
                      : { background: "#FDE8D0", color: "#4A2E1A" }
                    }
                  >{c}</button>
                ))}
              </div>
            </div>

            {(budget < 2000 || maxDist < 10 || selectedCuisine !== "All") && (
              <button
                onClick={() => { setBudget(2000); setMaxDist(10); setSelectedCuisine("All"); }}
                className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold text-[#E8360A] border-2 hover:bg-[#FDE8D0] transition-colors"
                style={{ borderColor: "rgba(232,54,10,0.2)" }}
              >
                ✕ Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[#8C6A52] text-sm font-semibold">
              <span className="text-[#1A0A00] font-black text-base">{filtered.length}</span> restaurants found
            </p>
            <span className="text-[#8C6A52] text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#FDE8D0" }}>
              Sorted by Score
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="card-warm py-20 text-center">
              <div className="text-6xl mb-3">🍽️</div>
              <p className="text-[#4A2E1A] text-sm font-bold">No restaurants match your filters</p>
              <p className="text-[#8C6A52] text-xs mt-1">Try adjusting budget or distance</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 stagger">
              {[...filtered].sort((a, b) => b.worthItScore - a.worthItScore).map((r) => (
                <div
                  key={r.id}
                  onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
                  className="card-warm cursor-pointer overflow-hidden"
                >
                  <div className="h-36 flex items-center justify-center text-7xl relative" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0,#FFF8E0)" }}>
                    <span className="float-emoji">{r.image}</span>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide" style={{ background: r.tagColor }}>
                      {r.tag}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <Star size={11} className="text-[#FF9F1C] fill-[#FF9F1C]" />
                      <span className="text-[#1A0A00] text-xs font-black">{r.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-black text-[#1A0A00] text-lg truncate">{r.name}</h3>
                        <p className="text-[#8C6A52] text-xs mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold">{r.cuisine}</span>
                          <span className="w-1 h-1 rounded-full bg-[#F9C9A0]" />
                          <MapPin size={9} className="inline" /> {r.distance} km
                        </p>
                      </div>
                      <WorthItBadge score={r.worthItScore} size="md" />
                    </div>
                    {/* Top dish preview */}
                    <div className="mt-4 rounded-2xl p-3 flex items-center gap-3" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                      <span className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                        {r.topDishes[0].emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#8C6A52] text-[10px] font-black uppercase tracking-wider">Top Dish</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#1A0A00] font-bold text-sm truncate">{r.topDishes[0].name}</p>
                          <p className="text-[#E8360A] font-black text-xs ml-2">₹{r.topDishes[0].price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[#8C6A52] text-xs font-semibold">₹{r.priceForTwo} for two</span>
                      <ScorePill score={r.worthItScore} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const totalSpent = pastBills.reduce((a, b) => a + b.amount, 0);
  const totalSaved = pastBills.reduce((a, b) => a + b.saved, 0);
  const avgRating  = (pastBills.reduce((a, b) => a + b.avgRating, 0) / pastBills.length).toFixed(1);

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
            <h1 className="font-display text-3xl font-black text-white">Rahul Kumar</h1>
            <p className="text-white/75 text-sm mt-1 font-medium">rahul.kumar@email.com</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 stagger">
        {[
          { label: "Total Spent",   value: `₹${totalSpent.toLocaleString()}`, accent: "#3b82f6", bg: "#EFF6FF", icon: <CreditCard size={20} /> },
          { label: "Money Saved",   value: `₹${totalSaved.toLocaleString()}`, accent: "#16a34a", bg: "#DCFCE7", icon: <CheckCircle2 size={20} /> },
          { label: "Bills Scanned", value: String(pastBills.length),          accent: "#a855f7", bg: "#F3E8FF", icon: <Receipt size={20} /> },
          { label: "Avg Rating",    value: `${avgRating}★`,                  accent: "#FF9F1C", bg: "#FFF7ED", icon: <Star size={20} className="fill-current" /> },
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

      {/* Savings banner */}
      <div className="mt-6 rounded-2xl p-5 flex items-center gap-4 border-2" style={{ background: "#DCFCE7", borderColor: "rgba(22,163,74,0.2)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,163,74,0.15)" }}>
          <TrendingUp size={22} className="text-green-600" />
        </div>
        <div>
          <p className="text-green-800 font-bold text-sm">You saved ₹{totalSaved} this month! 🎉</p>
          <p className="text-green-600 text-xs mt-0.5 font-medium">BudgetBit found smarter alternatives for you.</p>
        </div>
      </div>

      {/* Past Bills */}
      <div className="mt-10">
        <SectionHead sub="Your complete dining history">Past Bills</SectionHead>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {pastBills.map((bill) => (
            <div key={bill.id} className="card-warm p-5">
              <div className="flex items-start justify-between gap-2 mb-4 pb-4 border-b-2" style={{ borderColor: "rgba(232,54,10,0.07)" }}>
                <div>
                  <h3 className="font-bold text-[#1A0A00] text-base">{bill.restaurant}</h3>
                  <p className="text-[#8C6A52] text-xs mt-1 flex items-center gap-1">
                    <FileText size={10} /> {bill.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-[#E8360A] text-lg">₹{bill.amount}</p>
                  <div className="flex items-center gap-0.5 mt-1 justify-end">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={10} className={s <= Math.round(bill.avgRating) ? "text-[#FF9F1C] fill-[#FF9F1C]" : "text-[#F9C9A0] fill-[#F9C9A0]"} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {bill.dishes.map((d) => (
                  <span key={d} className="text-[#B52800] font-semibold text-[10px] px-2.5 py-1 rounded-full" style={{ background: "#FDE8D0" }}>{d}</span>
                ))}
              </div>
              {bill.saved > 0 && (
                <div className="flex items-center gap-1.5 mt-2 p-2.5 rounded-xl" style={{ background: "#DCFCE7" }}>
                  <CheckCircle2 size={12} className="text-green-600" />
                  <span className="text-green-700 text-[10px] font-black uppercase tracking-wide">Saved ₹{bill.saved}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-8 card-warm p-6">
        <h3 className="text-[#1A0A00] font-bold text-sm mb-5 flex items-center gap-2">
          <Settings size={16} style={{ color: "#E8360A" }} /> Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Favorite Cuisine", value: "South Indian", emoji: "🥞" },
            { label: "Avg Budget",       value: "₹500 for two",  emoji: "💰" },
            { label: "Location",         value: "Bengaluru, KA", emoji: "📍" },
          ].map((p) => (
            <div key={p.label} className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: "1.5px solid rgba(232,54,10,0.08)" }}>
              <p className="text-3xl mb-2">{p.emoji}</p>
              <p className="text-[#8C6A52] text-xs font-semibold mb-0.5">{p.label}</p>
              <p className="text-[#1A0A00] font-bold text-sm">{p.value}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 border-2" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                       = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [extractedDishes, setExtractedDishes] = useState([]);

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />;
      case "upload":     return <UploadPage setPage={setPage} setExtractedDishes={setExtractedDishes} />;
      case "rate":       return <RatePage extractedDishes={extractedDishes} setPage={setPage} />;
      case "explore":    return <ExplorePage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />;
      case "restaurant": return <RestaurantPage restaurant={selectedRestaurant} setPage={setPage} />;
      case "profile":    return <ProfilePage />;
      default:           return <HomePage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      {page !== "rate" && <NavBar active={page} setPage={setPage} />}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {renderPage()}
      </main>
    </div>
  );
}
