import { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorthItBadge from "./WorthItBadge";

const BILL_ITEMS = [
  { name: "Paneer Tikka", cat: "STARTER", price: "₹240", score: 91 },
  { name: "Butter Naan",  cat: "BREAD",   price: "₹60",  score: 88 },
  { name: "Jeera Rice",   cat: "MAIN",    price: "₹180", score: 84 },
];

export default function SnapScanScore() {
  const navigate = useNavigate();
  const [phase, setPhase]               = useState("idle");
  const [visibleItems, setVisibleItems] = useState([]);
  const [scoreVal, setScoreVal]         = useState(0);
  const [scanY, setScanY]               = useState(0);
  const timers   = useRef([]);
  const rafId    = useRef(null);
  const counterId= useRef(null);
  const sectionRef = useRef(null);
  const running  = useRef(false);

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

  function runSequence() {
    setPhase("idle"); setVisibleItems([]); setScoreVal(0); setScanY(0);
    t(() => setPhase("flash"),   600);
    t(() => { setPhase("scanning"); animateScan(); }, 1100);
    t(() => { setPhase("extracting"); setVisibleItems([0]); },  2600);
    t(() => setVisibleItems([0, 1]), 3200);
    t(() => setVisibleItems([0, 1, 2]), 3800);
    t(() => { setPhase("scored"); countUp(88); }, 4500);
    t(() => { runSequence(); }, 7200);
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (scoreVal / 100) * circ;

  return (
    <div ref={sectionRef} className="mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: animated phone ────────────────────────────── */}
        <div className="relative flex justify-center select-none">
          <div
            className="absolute inset-0 rounded-[60px] transition-all duration-700 pointer-events-none"
            style={{
              background: phase === "scored"
                ? "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(232,54,10,0.22) 0%, transparent 70%)"
                : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,54,10,0.08) 0%, transparent 70%)",
            }}
          />

          <div
            className="relative w-72 rounded-[44px] overflow-hidden shadow-2xl border-4"
            style={{ background: "#0F0500", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <span className="text-[9px] text-white/40 font-bold tracking-widest">9:41</span>
              <div className="w-20 h-4 rounded-full" style={{ background: "#1a1a1a" }} />
              <span className="text-[9px] text-white/40 font-bold">●●●</span>
            </div>

            <div
              className="relative mx-4 rounded-2xl overflow-hidden"
              style={{
                height: 280,
                background: phase === "idle" ? "#1A0800" : "linear-gradient(160deg,#1A0800 0%,#0a0300 100%)",
                border: "1.5px solid rgba(232,54,10,0.15)",
                transition: "all 0.4s ease",
              }}
            >
              {[
                { top: 8, left: 8 }, { top: 8, right: 8 },
                { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
              ].map((pos, i) => (
                <div
                  key={i} className="absolute w-6 h-6 pointer-events-none"
                  style={{
                    top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right,
                    borderColor: "#E8360A",
                    borderTopWidth: (i < 2) ? 2 : 0, borderBottomWidth: (i >= 2) ? 2 : 0,
                    borderLeftWidth: (i % 2 === 0) ? 2 : 0, borderRightWidth: (i % 2 === 1) ? 2 : 0,
                    borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
                    transition: "opacity 0.5s", opacity: phase === "idle" ? 0.4 : 1,
                  }}
                />
              ))}

              <div className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                style={{ background: "#ffffff", opacity: phase === "flash" ? 0.85 : 0, transition: phase === "flash" ? "opacity 0.08s" : "opacity 0.4s" }}
              />

              <div className="absolute inset-x-6 top-4 bottom-4 rounded-xl overflow-hidden shadow-xl"
                style={{
                  background: "#ffffff",
                  opacity: (phase === "idle" || phase === "flash") ? 0 : 1,
                  transform: (phase === "idle" || phase === "flash") ? "scale(0.9) translateY(10px)" : "scale(1) translateY(0)",
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
                    <div key={item.name} className="flex justify-between py-0.5"
                      style={{ opacity: visibleItems.includes(idx) ? 0.35 : 1, transition: "opacity 0.3s", background: visibleItems.includes(idx) ? "rgba(22,163,74,0.04)" : "transparent" }}
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

              {phase === "scanning" && (
                <div className="absolute inset-x-6 z-10 pointer-events-none"
                  style={{ top: `calc(16px + ${scanY * 2.3}px)`, height: 3,
                    background: "linear-gradient(90deg, transparent, #E8360A, #FF9F1C, #E8360A, transparent)",
                    boxShadow: "0 0 16px 4px rgba(232,54,10,0.55)", transition: "top 0.05s linear", borderRadius: 2 }}
                />
              )}

              {phase === "scored" && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 pointer-events-none z-30">
                  <div className="relative">
                    <svg width={90} height={90} className="-rotate-90">
                      <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} />
                      <circle cx={45} cy={45} r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth={5} strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.04s linear", filter: "drop-shadow(0 0 6px #E8360A)" }}
                      />
                      <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#E8360A" /><stop offset="100%" stopColor="#FF9F1C" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-black text-white text-2xl leading-none">{scoreVal}</span>
                      <span className="text-white/50 text-[8px] font-bold">SCORE</span>
                    </div>
                  </div>
                </div>
              )}

              {phase === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Camera size={36} style={{ color: "rgba(232,54,10,0.4)" }} />
                  <p className="text-[#8C6A52] text-[10px] font-bold">Point at your bill</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 py-5">
              <div className="w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
              <button className="w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all"
                style={{
                  background: phase === "scored" ? "linear-gradient(135deg,#E8360A,#FF9F1C)" : "rgba(255,255,255,0.12)",
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

            <div className="px-4 pb-5 text-center">
              <p className="text-xs font-bold transition-all duration-300" style={{ color: phase === "scored" ? "#FF9F1C" : "rgba(255,255,255,0.35)" }}>
                {phase === "idle"       && "Tap shutter to demo ↑"}
                {phase === "flash"      && "📸 Capturing..."}
                {phase === "scanning"   && "🔍 Scanning receipt..."}
                {phase === "extracting" && "⚡ Extracting items..."}
                {phase === "scored"     && "✅ Worth-It Score Ready!"}
              </p>
            </div>
          </div>

          <div className="absolute -right-6 top-24 bg-[#E8360A] text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl rotate-[8deg] z-20"
            style={{
              opacity: (phase === "extracting" || phase === "scored") ? 1 : 0,
              transform: (phase === "extracting" || phase === "scored") ? "rotate(8deg) scale(1)" : "rotate(8deg) scale(0.6)",
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

          <div className="space-y-3 mb-8">
            {BILL_ITEMS.map((item, idx) => (
              <div key={item.name} className="card-warm p-4 flex items-center gap-4 border-2"
                style={{
                  opacity: visibleItems.includes(idx) ? 1 : 0.2,
                  transform: visibleItems.includes(idx) ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.05}s`,
                  borderColor: visibleItems.includes(idx) ? "rgba(22,163,74,0.25)" : "rgba(232,54,10,0.07)",
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{ background: visibleItems.includes(idx) ? "#DCFCE7" : "#FDE8D0", transform: visibleItems.includes(idx) ? "scale(1)" : "scale(0.7)" }}
                >
                  {visibleItems.includes(idx) ? <CheckCircle2 size={18} className="text-green-600" /> : <div className="w-3 h-3 rounded-full" style={{ background: "#F9C9A0" }} />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm transition-all duration-300" style={{ color: visibleItems.includes(idx) ? "#1A0A00" : "#C4A090" }}>{item.name}</p>
                  <p className="text-[#8C6A52] text-[10px] font-bold tracking-widest uppercase mt-0.5">{item.cat}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm transition-all duration-300" style={{ color: visibleItems.includes(idx) ? "#E8360A" : "#C4A090" }}>{item.price}</p>
                  <p className="text-[9px] mt-0.5 font-semibold transition-all" style={{ color: visibleItems.includes(idx) ? "#8C6A52" : "#D4B8A8" }}>
                    {visibleItems.includes(idx) ? "✓ Extracted" : "Pending..."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 card-warm p-4 border-2 mb-6"
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
            <span className="ml-auto px-3 py-1.5 rounded-full text-[10px] font-black text-green-700 uppercase tracking-wider" style={{ background: "#DCFCE7" }}>Good Value</span>
          </div>

          <button
            onClick={() => navigate("/upload")}
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
