import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Star, SlidersHorizontal, Sparkles } from "lucide-react";
import { cuisines } from "../lib/mockData";
import { api } from "../api";
import WorthItBadge from "../components/WorthItBadge";
import ScorePill from "../components/ScorePill";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(2000);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [maxDist, setMaxDist] = useState(5);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPicks, setAiPicks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    api.restaurants.list().then(setRestaurants).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Fetch AI dish recommendations whenever budget or cuisine changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await api.ai.recommend({
          budget: Math.round(budget / 2), // per-dish budget = half of "for two"
          cuisines: selectedCuisine === "All" ? [] : [selectedCuisine],
          city: "Bangalore",
        });
        setAiPicks(res.recommendations || []);
      } catch {
        setAiPicks([]);
      } finally {
        setAiLoading(false);
      }
    }, 600); // debounce
    return () => clearTimeout(timer);
  }, [budget, selectedCuisine]);

  const filtered = restaurants.filter(
    (r) =>
      (r.avg_cost ?? r.price_for_two ?? 9999) <= budget &&
      (selectedCuisine === "All" || r.cuisine === selectedCuisine) &&
      (r.distance ?? 0) <= maxDist
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
              <input type="range" min="100" max="2000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: "#E8360A" }} />
              <div className="flex justify-between text-[10px] text-[#8C6A52] mt-1 font-semibold"><span>₹100</span><span>₹2000</span></div>
            </div>

            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider">📍 Distance</span>
                <span className="font-display font-black text-sm text-[#E8360A]">{maxDist} km</span>
              </div>
              <input type="range" min="0.5" max="10" step="0.5" value={maxDist} onChange={(e) => setMaxDist(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: "#E8360A" }} />
              <div className="flex justify-between text-[10px] text-[#8C6A52] mt-1 font-semibold"><span>0.5 km</span><span>10 km</span></div>
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
          {/* ── Gemini AI Picks ─────────────────────────────── */}
          {(aiPicks.length > 0 || aiLoading) && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[#E8360A]" />
                <p className="font-bold text-[#1A0A00] text-sm">
                  AI-Recommended Dishes{selectedCuisine !== "All" ? ` · ${selectedCuisine}` : ""} · Under ₹{Math.round(budget / 2)} each
                </p>
              </div>
              {aiLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card-warm p-4 animate-pulse h-20" style={{ background: "#FFF8F0" }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {aiPicks.map((pick, i) => (
                    <div key={i} className="card-warm p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                        🍽️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1A0A00] text-sm truncate">{pick.dish}</p>
                        <p className="text-[#8C6A52] text-[10px] truncate mt-0.5">{pick.restaurant}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[#E8360A] font-black text-xs">₹{pick.price}</span>
                          <ScorePill score={pick.score} />
                        </div>
                        {pick.reason && <p className="text-[#8C6A52] text-[9px] mt-1 leading-tight line-clamp-1">{pick.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 border-b-2 border-dashed" style={{ borderColor: "rgba(232,54,10,0.1)" }} />
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <p className="text-[#8C6A52] text-sm font-semibold">
              <span className="text-[#1A0A00] font-black text-base">{filtered.length}</span> restaurants found
            </p>
            <span className="text-[#8C6A52] text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#FDE8D0" }}>Sorted by Score</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-warm overflow-hidden animate-pulse">
                  <div className="h-36" style={{ background: "#FDE8D0" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded" style={{ background: "#FDE8D0", width: "60%" }} />
                    <div className="h-3 rounded" style={{ background: "#FDE8D0", width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-warm py-20 text-center">
              <div className="text-6xl mb-3">🍽️</div>
              <p className="text-[#4A2E1A] text-sm font-bold">No restaurants match your filters</p>
              <p className="text-[#8C6A52] text-xs mt-1">Try adjusting budget or distance</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 stagger">
              {[...filtered].sort((a, b) => (b.worth_it_score ?? 0) - (a.worth_it_score ?? 0)).map((r) => {
                const topDish = (r.top_dishes || [])[0];
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                    className="card-warm cursor-pointer overflow-hidden"
                  >
                    <div className="h-36 flex items-center justify-center text-7xl relative" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0,#FFF8E0)" }}>
                      <span className="float-emoji">{r.image_url || "🍽️"}</span>
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide" style={{ background: r.tag_color || "#E8360A" }}>
                        {r.tag || r.cuisine}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <Star size={11} className="text-[#FF9F1C] fill-[#FF9F1C]" />
                        <span className="text-[#1A0A00] text-xs font-black">{r.rating ?? "—"}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-black text-[#1A0A00] text-lg truncate">{r.name}</h3>
                          <p className="text-[#8C6A52] text-xs mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold">{r.cuisine}</span>
                            <span className="w-1 h-1 rounded-full bg-[#F9C9A0]" />
                            <MapPin size={9} className="inline" /> {r.distance ?? "?"} km
                          </p>
                        </div>
                        <WorthItBadge score={r.worth_it_score ?? 75} size="md" />
                      </div>
                      {topDish && (
                        <div className="mt-4 rounded-2xl p-3 flex items-center gap-3" style={{ background: "#FFF8F0", border: "1px solid rgba(232,54,10,0.08)" }}>
                          <span className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
                            {topDish.emoji || "🍽️"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#8C6A52] text-[10px] font-black uppercase tracking-wider">Top Dish</p>
                            <div className="flex items-center justify-between">
                              <p className="text-[#1A0A00] font-bold text-sm truncate">{topDish.name}</p>
                              <p className="text-[#E8360A] font-black text-xs ml-2">₹{topDish.price}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[#8C6A52] text-xs font-semibold">₹{r.avg_cost ?? r.price_for_two ?? "—"} for two</span>
                        <ScorePill score={r.worth_it_score ?? 75} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
