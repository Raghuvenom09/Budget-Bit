import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Star, Home, CheckCircle2, AlertCircle } from "lucide-react";
import WorthItBadge from "../components/WorthItBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function RatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const dishes = location.state?.dishes?.length ? location.state.dishes : null;
  const restaurantId = location.state?.restaurantId || null;
  const restaurantCuisine = location.state?.restaurantCuisine || "Indian";
  const restaurantCity = location.state?.restaurantCity || "Bangalore";

  const [ratings, setRatings] = useState(
    dishes ? dishes.map(() => ({ taste: 3, value: 3, portion: 3 })) : []
  );
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [aiScore, setAiScore] = useState(null);

  const update = (dIdx, key, val) =>
    setRatings((prev) => prev.map((r, i) => (i === dIdx ? { ...r, [key]: val } : r)));

  // Live preview score 0-100: average of all (taste+value+portion)/3, scaled ×20
  const previewScore = ratings.length
    ? Math.round(
        (ratings.reduce((acc, r) => acc + (r.taste + r.value + r.portion) / 3, 0) / ratings.length) * 20
      )
    : 60;
  const overallScore = aiScore ?? previewScore;

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError(null);
    let finalScore = previewScore;

    try {
      // Ask AI to score each dish, then average
      try {
        const scores = await Promise.all(
          dishes.map((d, i) =>
            api.ai.score({
              dish_name: d.name,
              price: d.price,
              cuisine: restaurantCuisine,
              city: restaurantCity,
              taste: ratings[i].taste,
              value: ratings[i].value,
              portion: ratings[i].portion,
            }).then((r) => r.score ?? previewScore)
          )
        );
        finalScore = Math.round(scores.reduce((a, s) => a + s, 0) / scores.length);
      } catch {
        // AI service unreachable — use local heuristic score
      }

      setAiScore(finalScore);

      if (user && restaurantId) {
        await api.reviews.create({
          user_id: user.id,
          restaurant_id: restaurantId,
          dishes: dishes.map((d, i) => ({
            name: d.name,
            price: d.price,
            taste: ratings[i].taste,
            value: ratings[i].value,
            portion: ratings[i].portion,
          })),
          overall_score: finalScore,
          avg_rating: ratings.reduce((acc, r) => acc + (r.taste + r.value + r.portion) / 3, 0) / ratings.length,
        });
      }

      setSubmitted(true);
    } catch (e) {
      console.error("Failed to save review:", e);
      setSaveError("Couldn't save your review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Guard: if no dishes were passed, show an empty state with navigation
  if (!dishes) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
        <div className="text-6xl mb-6">🧾</div>
        <h2 className="font-display text-3xl font-black text-[#1A0A00] mb-3">No bill to rate</h2>
        <p className="text-[#8C6A52] text-sm text-center mb-8 max-w-xs font-medium">
          Upload a bill first, then come back here to rate your meal.
        </p>
        <Link
          to="/upload"
          className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl text-sm"
          style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
        >
          Upload a Bill
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
        <div className="text-8xl mb-6 float-emoji">🎉</div>
        <WorthItBadge score={overallScore} size="lg" />
        <h2 className="font-display text-4xl font-black text-[#1A0A00] mt-6 mb-2">Review Submitted!</h2>
        <p className="text-[#8C6A52] text-sm text-center mb-10 max-w-xs font-medium">
          {restaurantId
            ? "Your ratings sharpen the Worth-It scores for the whole community."
            : "Your ratings were recorded. Link a restaurant next time to contribute to community scores."}
        </p>
        <button
          onClick={() => navigate("/")}
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

      {saveError && (
        <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 border-2 text-red-700" style={{ background: "#FEE2E2", borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertCircle size={18} className="flex-shrink-0" />
          <p className="text-sm font-semibold">{saveError}</p>
        </div>
      )}

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
              { key: "taste", label: "Taste", emoji: "😋" },
              { key: "value", label: "Value for Money", emoji: "💸" },
              { key: "portion", label: "Portion Size", emoji: "🥘" },
            ].map(({ key, label, emoji }) => (
              <div key={key} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[#4A2E1A] text-sm font-semibold flex items-center gap-1.5">{emoji} {label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => update(dIdx, key, star)}
                        aria-label={`${label} ${star} star`}
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
                  aria-label={`${label} slider`}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8360A ${(ratings[dIdx][key] - 1) * 25}%, #FDE8D0 ${(ratings[dIdx][key] - 1) * 25}%)` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card-warm p-6 flex items-center justify-between mt-6 border-2" style={{ borderColor: "rgba(232,54,10,0.12)" }}>
        <div>
          <p className="font-bold text-[#1A0A00] text-base">Live Worth-It Score</p>
          <p className="text-[#8C6A52] text-xs mt-1 font-medium">Updates live as you rate each dish</p>
        </div>
        <WorthItBadge score={overallScore} size="lg" />
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full mt-5 py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
      >
        {saving ? "Saving…" : <><CheckCircle2 size={20} /> Submit Review</>}
      </button>
    </div>
  );
}
