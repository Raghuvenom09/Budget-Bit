import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { restaurants } from "../lib/mockData";
import WorthItBadge from "../components/WorthItBadge";
import StarRating from "../components/StarRating";
import ScorePill from "../components/ScorePill";
import SectionHead from "../components/SectionHead";

export default function RestaurantPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const r = restaurants.find((rest) => rest.id === Number(id)) || restaurants[0];

  const breakdown = [
    { label: "Google Rating", value: r.googleRating * 20, raw: `${r.googleRating}/5`, color: "#FF9F1C" },
    { label: "Social Buzz", value: r.socialBuzz, raw: `${r.socialBuzz}/100`, color: "#3b82f6" },
    { label: "Community Reviews", value: r.communityReviews, raw: `${r.communityReviews}/100`, color: "#16a34a" },
  ];

  return (
    <div className="pb-16 w-full">
      {/* Hero */}
      <div className="relative rounded-3xl mt-6 overflow-hidden" style={{ height: 300, background: "linear-gradient(135deg,#FDE8D0,#FFF0D0,#FFF8E0)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-[180px] opacity-30 select-none">
          {r.image}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,248,240,0.98) 0%, rgba(255,248,240,0.3) 55%, transparent 100%)" }} />
        <button
          onClick={() => navigate("/explore")}
          className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors hover:bg-[#FDE8D0]"
          style={{ background: "#ffffff", border: "1.5px solid rgba(232,54,10,0.15)" }}
        >
          <ChevronLeft size={22} style={{ color: "#E8360A" }} />
        </button>
        <div
          className="absolute top-6 right-6 px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-wide"
          style={{ background: r.tagColor || "#E8360A" }}
        >
          {r.tag}
        </div>
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
                    <div className="h-full rounded-full bar-fill" style={{ width: `${b.value}%`, background: b.color, boxShadow: `0 0 6px ${b.color}60` }} />
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

        <div className="lg:col-span-2">
          <SectionHead>🍽️ Top Dishes</SectionHead>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {r.topDishes.map((d, i) => (
              <div key={i} className="card-warm p-4 flex items-center gap-4">
                <div className="text-3xl w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>
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
