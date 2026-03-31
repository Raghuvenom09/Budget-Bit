import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Star, SlidersHorizontal, Sparkles, LocateFixed, Clock3, ExternalLink } from "lucide-react";
import { cuisines } from "../lib/mockData";
import { api } from "../api";
import WorthItBadge from "../components/WorthItBadge";
import ScorePill from "../components/ScorePill";

// Render image_url as <img> if it's a URL, otherwise as an emoji
function RestaurantThumb({ imageUrl, emojiClass = "float-emoji" }) {
  const isUrl = imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"));
  if (isUrl) {
    return <img src={imageUrl} alt="" className="w-full h-full object-cover" />;
  }
  return <span className={emojiClass}>{imageUrl || "🍽️"}</span>;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(2000);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [maxDist, setMaxDist] = useState(5);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [aiPicks, setAiPicks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState("Using stored distance estimates");
  const [selectedMapRestaurantId, setSelectedMapRestaurantId] = useState(null);

  useEffect(() => {
    api.restaurants.list()
      .then(setRestaurants)
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Clear map selection when filters change
  useEffect(() => {
    setSelectedMapRestaurantId(null);
  }, [budget, selectedCuisine, maxDist, openNowOnly, userCoords]);

  const toMinutes = (value) => {
    if (!value || typeof value !== "string") return null;
    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return hour * 60 + minute;
  };

  const isRestaurantOpenNow = (restaurant) => {
    if (typeof restaurant.open_now === "boolean") return restaurant.open_now;

    const openTimeRaw = restaurant.open_time || restaurant.opens_at || restaurant.opening_time;
    const closeTimeRaw = restaurant.close_time || restaurant.closes_at || restaurant.closing_time;
    const openMinutes = toMinutes(openTimeRaw);
    const closeMinutes = toMinutes(closeTimeRaw);

    // If hours unknown, treat as "hours not available" — don't assume open
    if (openMinutes === null || closeMinutes === null) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (closeMinutes > openMinutes) {
      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }

    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  };

  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const getDistanceKm = (restaurant) => {
    if (!userCoords) return Number(restaurant.distance ?? 999);
    const lat = Number(restaurant.latitude ?? restaurant.lat);
    const lng = Number(restaurant.longitude ?? restaurant.lng ?? restaurant.lon);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return haversineKm(userCoords.latitude, userCoords.longitude, lat, lng);
    }
    return Number(restaurant.distance ?? 999);
  };

  const getValueRankScore = (restaurant) => {
    const worthScore = Number(restaurant.worth_it_score ?? 70);
    const cost = Number(restaurant.avg_cost ?? 2000);
    const distanceKm = getDistanceKm(restaurant);
    const isOpen = isRestaurantOpenNow(restaurant);
    const openBoost = isOpen === true ? 8 : isOpen === false ? -8 : 0;
    const valuePart = worthScore * 0.9;
    const distancePenalty = Math.min(distanceKm, 10) * 2.4;
    const costPenalty = Math.min(cost, 3000) / 140;
    return valuePart + openBoost - distancePenalty - costPenalty;
  };

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMsg("Location not supported by this browser");
      return;
    }
    setLocating(true);
    setLocationMsg("Detecting your current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocating(false);
        setLocationMsg("Using current location for nearby ranking");
      },
      () => {
        setLocating(false);
        setLocationMsg("Location access denied. Using stored estimates");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fetch AI dish recommendations whenever budget or cuisine changes (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await api.ai.recommend({
          budget: Math.round(budget / 2),
          cuisines: selectedCuisine === "All" ? [] : [selectedCuisine],
          city: "Bangalore",
        });
        setAiPicks(res.recommendations || []);
      } catch {
        setAiPicks([]);
      } finally {
        setAiLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [budget, selectedCuisine]);

  const filtered = restaurants.filter((restaurant) => {
    const withinBudget = (restaurant.avg_cost ?? 9999) <= budget;
    const cuisineMatch = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    const withinDistance = getDistanceKm(restaurant) <= maxDist;
    const isOpen = isRestaurantOpenNow(restaurant);
    // When "Open Now Only" is on, skip restaurants with known-closed status; include unknown-hours ones
    const openMatch = openNowOnly ? isOpen !== false : true;
    return withinBudget && cuisineMatch && withinDistance && openMatch;
  });

  const sortedRestaurants = [...filtered].sort((a, b) => getValueRankScore(b) - getValueRankScore(a));
  const bestRatedRestaurant = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0] || null;
  const selectedMapRestaurant =
    sortedRestaurants.find((r) => r.id === selectedMapRestaurantId) || bestRatedRestaurant;

  const lat = selectedMapRestaurant ? Number(selectedMapRestaurant.latitude ?? selectedMapRestaurant.lat) : null;
  const lng = selectedMapRestaurant ? Number(selectedMapRestaurant.longitude ?? selectedMapRestaurant.lng ?? selectedMapRestaurant.lon) : null;
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const getMapsQuery = (restaurant) => {
    if (!restaurant) return "Bangalore restaurants";
    const query = `${restaurant.name || "Restaurant"} ${restaurant.address || ""}`.trim();
    return encodeURIComponent(query || "Restaurant near me");
  };

  const mapEmbedUrl = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
    : null;
  
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${getMapsQuery(selectedMapRestaurant)}`;

  const hasActiveFilters = budget < 2000 || maxDist < 10 || selectedCuisine !== "All" || openNowOnly;

  return (
    <div className="pb-16 w-full">
      {/* Header */}
      <div
        className="rounded-3xl mt-6 px-6 sm:px-10 py-8 sm:py-12 relative overflow-hidden border-2 mb-6 sm:mb-8"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)", borderColor: "transparent" }}
      >
        <div className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 text-[60px] sm:text-[120px] opacity-10 select-none float-emoji">🗺️</div>
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          <Compass size={12} /> Discover
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">Explore Restaurants</h1>
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
              <input type="range" min="100" max="5000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: "#E8360A" }} />
              <div className="flex justify-between text-[10px] text-[#8C6A52] mt-1 font-semibold"><span>₹100</span><span>₹5000</span></div>
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

            <div className="mt-7">
              <p className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider mb-3">⏰ Availability</p>
              <button
                onClick={() => setOpenNowOnly((prev) => !prev)}
                className="w-full py-2.5 rounded-xl text-xs font-bold border-2 transition-colors flex items-center justify-center gap-2"
                style={openNowOnly
                  ? { borderColor: "#16A34A", color: "#166534", background: "#DCFCE7" }
                  : { borderColor: "rgba(232,54,10,0.2)", color: "#4A2E1A", background: "#FFF8F0" }}
              >
                <Clock3 size={14} /> {openNowOnly ? "Open Now Only: ON" : "Open Now Only: OFF"}
              </button>
            </div>

            <div className="mt-7">
              <p className="text-[#8C6A52] text-xs font-bold uppercase tracking-wider mb-3">📍 Current Location</p>
              <button
                onClick={requestCurrentLocation}
                disabled={locating}
                aria-label="Use current location"
                className="w-full py-2.5 rounded-xl text-xs font-bold border-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ borderColor: "rgba(232,54,10,0.2)", color: "#E8360A", background: "#FFF8F0" }}
              >
                <LocateFixed size={14} /> {locating ? "Locating..." : "Use Current Location"}
              </button>
              <p className="text-[10px] text-[#8C6A52] font-semibold mt-2">{locationMsg}</p>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setBudget(2000);
                  setMaxDist(10);
                  setSelectedCuisine("All");
                  setOpenNowOnly(false);
                }}
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

          {/* ── Map View ─────────────────────────────────────── */}
          {sortedRestaurants.length > 0 && (
            <div className="mb-8 card-warm p-5">
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <p className="font-bold text-[#1A0A00] text-sm">Map View · Best rated near you</p>
                {bestRatedRestaurant && (
                  <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                    👑 Best Rating: {bestRatedRestaurant.name} ({bestRatedRestaurant.rating ?? "—"})
                  </span>
                )}
              </div>

              {mapEmbedUrl ? (
                <div className="rounded-2xl overflow-hidden border-2 relative" style={{ borderColor: "rgba(232,54,10,0.12)" }}>
                  <iframe
                    title="Restaurant map"
                    src={mapEmbedUrl}
                    className="w-full h-72 border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  {/* Overlay to disable scroll-to-zoom on desktop until clicked */}
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>
                </div>
              ) : (
                /* Fallback when no valid coordinates — show a styled "Open in Maps" card */
                <div
                  className="rounded-2xl h-40 flex flex-col items-center justify-center gap-3 border-2"
                  style={{ background: "#FFF8F0", borderColor: "rgba(232,54,10,0.12)", borderStyle: "dashed" }}
                >
                  <span className="text-3xl">🗺️</span>
                  <p className="text-[#8C6A52] text-xs font-semibold text-center px-6">
                    Location coordinates unavailable. Click below to open in Maps.
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs font-semibold text-[#8C6A52]">
                  Showing: <span className="text-[#1A0A00] font-bold">{selectedMapRestaurant?.name || "—"}</span>
                </p>
                <a
                  href={mapOpenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                  style={{ background: "#FDE8D0", color: "#E8360A" }}
                >
                  Open in Google Maps <ExternalLink size={13} />
                </a>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {sortedRestaurants.slice(0, 10).map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => setSelectedMapRestaurantId(restaurant.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-colors"
                    style={selectedMapRestaurant?.id === restaurant.id
                      ? { background: "linear-gradient(135deg,#E8360A,#FF9F1C)", color: "#fff", borderColor: "transparent" }
                      : { background: "#FFF8F0", color: "#4A2E1A", borderColor: "rgba(232,54,10,0.15)" }}
                  >
                    {restaurant.name} ⭐ {restaurant.rating ?? "—"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <p className="text-[#8C6A52] text-sm font-semibold">
              <span className="text-[#1A0A00] font-black text-base">{filtered.length}</span> restaurants found
            </p>
            <span className="text-[#8C6A52] text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#FDE8D0" }}>
              Sorted by Best Nearby Value
            </span>
          </div>

          {loadError ? (
            <div className="card-warm py-16 text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-[#4A2E1A] font-bold text-sm">Failed to load restaurants</p>
              <p className="text-[#8C6A52] text-xs mt-1">{loadError}</p>
            </div>
          ) : loading ? (
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
              {sortedRestaurants.map((r) => {
                const topDish = (r.top_dishes || [])[0];
                const isOpen = isRestaurantOpenNow(r);
                const effectiveDistance = getDistanceKm(r);
                const openLabel = isOpen === null ? "Hours unknown" : isOpen ? "Open now" : "Closed";
                const openColor = isOpen === null ? "text-[#8C6A52]" : isOpen ? "text-green-700" : "text-red-600";
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                    className="card-warm cursor-pointer overflow-hidden"
                  >
                    <div className="h-36 flex items-center justify-center text-7xl relative overflow-hidden" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0,#FFF8E0)" }}>
                      <RestaurantThumb imageUrl={r.image_url} />
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
                            <MapPin size={9} className="inline" /> {Number.isFinite(effectiveDistance) ? effectiveDistance.toFixed(1) : "?"} km
                            <span className="w-1 h-1 rounded-full bg-[#F9C9A0]" />
                            <span className={openColor}>{openLabel}</span>
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
                        <span className="text-[#8C6A52] text-xs font-semibold">₹{r.avg_cost ?? "—"} for two</span>
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
