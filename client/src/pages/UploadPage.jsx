import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera, Image as ImageIcon, Receipt, Zap,
  CheckCircle2, Trash2, Star, MapPin, Calendar, Search, AlertCircle,
} from "lucide-react";
import SectionHead from "../components/SectionHead";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [stage, setStage] = useState("idle"); // idle → preview → extracted
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [billImageUrl, setBillImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [savingBill, setSavingBill] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // ── OCR metadata ────────────────────────────────────────────────────────────
  const [ocrRestaurant, setOcrRestaurant] = useState(null);
  const [ocrDate, setOcrDate] = useState(null);
  const [ocrTotal, setOcrTotal] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(null);

  // ── Restaurant matching ─────────────────────────────────────────────────────
  const [matchedRestaurant, setMatchedRestaurant] = useState(null);
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [showRestaurantPicker, setShowRestaurantPicker] = useState(false);

  // Fuzzy-match OCR restaurant name against DB
  const matchRestaurant = async (name) => {
    if (!name) return;
    try {
      const all = await api.restaurants.list({});
      const lower = name.toLowerCase();
      const exact = all.find((r) => r.name.toLowerCase() === lower);
      if (exact) { setMatchedRestaurant(exact); return; }
      const partial = all.find((r) =>
        r.name.toLowerCase().includes(lower) || lower.includes(r.name.toLowerCase())
      );
      if (partial) { setMatchedRestaurant(partial); return; }
      setRestaurantResults(all);
      setRestaurantSearch(name);
      setShowRestaurantPicker(true);
    } catch (e) {
      console.error("Restaurant match failed:", e);
    }
  };

  // Search restaurants when user types in the picker
  useEffect(() => {
    if (!showRestaurantPicker || !restaurantSearch) return;
    const timeout = setTimeout(async () => {
      try {
        const results = await api.restaurants.list({ search: restaurantSearch });
        setRestaurantResults(results);
      } catch (e) {
        console.error("Restaurant search failed:", e);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [restaurantSearch, showRestaurantPicker]);

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload a JPG, PNG, WebP, or PDF.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileSelected = async (file) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError(null);
    setUploadedFile(file);
    setOcrError(null);
    setOcrRestaurant(null);
    setOcrDate(null);
    setOcrTotal(null);
    setOcrConfidence(null);
    setMatchedRestaurant(null);
    setShowRestaurantPicker(false);
    setBillImageUrl(null);
    setStage("preview");

    // Create local preview
    setImagePreview(URL.createObjectURL(file));

    // Simulate progress while OCR runs (indeterminate)
    setScanProgress(0);
    const progressInterval = setInterval(() => {
      setScanProgress((p) => (p >= 85 ? 85 : p + Math.random() * 12));
    }, 400);

    // Call AI OCR to extract everything from the bill
    let ocrResult = null;
    try {
      ocrResult = await api.ai.ocr(file);

      setOcrRestaurant(ocrResult.restaurant || null);
      setOcrDate(ocrResult.date || null);
      setOcrTotal(ocrResult.total || null);
      setOcrConfidence(ocrResult.confidence ?? null);

      const extracted = (ocrResult.items || []).map((item) => ({
        name: item.name || "",
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1,
      }));
      setDishes(extracted.length ? extracted : [{ name: "", price: 0, qty: 1 }]);

      if (ocrResult.restaurant) {
        await matchRestaurant(ocrResult.restaurant);
      }
    } catch (e) {
      console.error("OCR failed:", e);
      setOcrError("Couldn't read the bill automatically — please enter items manually.");
      setDishes([{ name: "", price: 0, qty: 1 }]);
    }

    // Upload image to Supabase storage AFTER OCR — avoids orphaned files on OCR failure
    if (user && ocrResult !== null) {
      try {
        const url = await api.storage.uploadBillImage(user.id, file);
        setBillImageUrl(url);
      } catch (e) {
        console.error("Image upload failed:", e);
        // Non-blocking — bill can still be saved without image URL
      }
    }

    clearInterval(progressInterval);
    setScanProgress(100);
    setStage("extracted");
  };

  const addDish = () => setDishes((prev) => [...prev, { name: "", price: 0, qty: 1 }]);
  const updateDish = (idx, field, val) =>
    setDishes((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  const removeDish = (idx) => setDishes((prev) => prev.filter((_, i) => i !== idx));

  // Correct total: sum of price × qty for each dish
  const billTotal = dishes.reduce((a, d) => a + d.price * (d.qty || 1), 0);

  const handleRate = async () => {
    const restaurantId = matchedRestaurant?.id || null;

    if (user) {
      setSavingBill(true);
      try {
        await api.bills.create({
          user_id: user.id,
          amount: billTotal,
          image_url: billImageUrl,
          dishes: dishes.map((d) => d.name),
          restaurant_id: restaurantId,
        });
      } catch (e) {
        console.error("Bill save failed:", e);
      } finally {
        setSavingBill(false);
      }
    }

    navigate("/rate", {
      state: {
        dishes,
        restaurantId,
        restaurantName: matchedRestaurant?.name || ocrRestaurant || null,
        restaurantCuisine: matchedRestaurant?.cuisine || null,
        restaurantCity: matchedRestaurant?.city || null,
      },
    });
  };

  // Cleanup preview URL on unmount or when imagePreview changes
  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

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
            {fileError && (
              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3 border-2 text-red-700" style={{ background: "#FEE2E2", borderColor: "rgba(239,68,68,0.2)" }}>
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="text-sm font-semibold">{fileError}</p>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelected(e.dataTransfer.files[0]); }}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files[0])}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all active:scale-[0.98] hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
              >
                <Camera size={18} /> Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-[#FDE8D0] active:scale-[0.98] border-2"
                style={{ background: "#ffffff", color: "#E8360A", borderColor: "rgba(232,54,10,0.2)" }}
              >
                <ImageIcon size={18} /> Gallery
              </button>
            </div>

            <div className="mt-10">
              <SectionHead>Recent Bills</SectionHead>
              <div className="card-warm p-6 text-center">
                <div className="text-4xl mb-2">🧾</div>
                <p className="text-[#8C6A52] text-sm font-semibold">Your past bills will appear here after uploading.</p>
              </div>
            </div>
          </div>
        )}

        {stage === "preview" && (
          <div className="card-warm p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {imagePreview && (
                <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 flex-shrink-0 shadow-lg" style={{ borderColor: "rgba(232,54,10,0.15)" }}>
                  <img src={imagePreview} alt="Bill" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <div className="relative mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl animate-pulse mx-auto sm:mx-0"
                    style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
                  >
                    <Receipt size={28} className="text-white" />
                  </div>
                </div>
                <p className="text-[#1A0A00] font-bold text-lg mb-1">Scanning your bill…</p>
                <p className="text-[#8C6A52] text-sm mb-4">AI is extracting dishes, prices &amp; restaurant info</p>

                <div className="w-full bg-[#FDE8D0] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${scanProgress}%`,
                      background: "linear-gradient(135deg,#E8360A,#FF9F1C)",
                    }}
                  />
                </div>
                <p className="text-[#8C6A52] text-xs mt-2 font-semibold">{Math.round(scanProgress)}%</p>
              </div>
            </div>
          </div>
        )}

        {stage === "extracted" && (
          <div className="stagger">
            {/* ── Scan result banner ─────────────────────────────────────── */}
            {ocrError ? (
              <div className="card-warm p-5 flex items-center gap-4 mb-6 border-2" style={{ borderColor: "rgba(234,179,8,0.35)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FEF9C3" }}>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#1A0A00] font-bold text-sm">Couldn't auto-read the bill</p>
                  <p className="text-[#8C6A52] text-xs mt-0.5">{ocrError}</p>
                </div>
              </div>
            ) : (
              <div className="card-warm p-5 flex items-center gap-4 mb-6 border-2" style={{ borderColor: "rgba(22,163,74,0.2)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#DCFCE7" }}>
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1A0A00] font-bold text-sm">Bill scanned with AI!</p>
                  <p className="text-[#8C6A52] text-xs mt-0.5">{dishes.length} items detected — review &amp; edit below</p>
                </div>
                {ocrConfidence !== null && (
                  <div className="flex flex-col items-center">
                    <span className="text-green-600 text-lg font-black">{Math.round(ocrConfidence * 100)}%</span>
                    <span className="text-[#8C6A52] text-[10px] font-bold uppercase tracking-wider">Accuracy</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Restaurant & Bill info card ────────────────────────────── */}
            <div className="card-warm p-5 mb-6">
              <div className="flex gap-4">
                {imagePreview && (
                  <div className="w-20 h-28 rounded-xl overflow-hidden border-2 flex-shrink-0 shadow-md" style={{ borderColor: "rgba(232,54,10,0.1)" }}>
                    <img src={imagePreview} alt="Bill" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {matchedRestaurant ? (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#E8360A] flex-shrink-0" />
                      <span className="font-bold text-[#1A0A00] text-sm truncate">{matchedRestaurant.name}</span>
                      <span className="text-green-600 text-[10px] font-bold uppercase bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">Matched</span>
                    </div>
                  ) : ocrRestaurant ? (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#E8360A] flex-shrink-0" />
                      <span className="font-bold text-[#1A0A00] text-sm truncate">{ocrRestaurant}</span>
                      <button
                        onClick={() => setShowRestaurantPicker(true)}
                        className="text-[#E8360A] text-[10px] font-bold uppercase bg-[#FDE8D0] px-2 py-0.5 rounded-full flex-shrink-0 hover:bg-[#FDD8B0] transition-colors"
                      >Link</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#8C6A52] flex-shrink-0" />
                      <button
                        onClick={() => setShowRestaurantPicker(true)}
                        className="text-[#E8360A] text-xs font-bold hover:underline"
                      >+ Select Restaurant</button>
                    </div>
                  )}

                  {ocrDate && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-[#8C6A52] flex-shrink-0" />
                      <span className="text-[#8C6A52] text-xs font-semibold">{ocrDate}</span>
                    </div>
                  )}

                  {ocrTotal != null && ocrTotal > 0 && (
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className="text-[#8C6A52] flex-shrink-0" />
                      <span className="text-[#8C6A52] text-xs font-semibold">
                        Bill total: <span className="text-[#E8360A] font-black">₹{ocrTotal}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Restaurant Picker Modal ──────────────────────────────── */}
            {showRestaurantPicker && (
              <div className="card-warm p-5 mb-6 border-2" style={{ borderColor: "rgba(232,54,10,0.15)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-[#1A0A00] text-sm flex items-center gap-2">
                    <Search size={14} /> Select Restaurant
                  </h4>
                  <button
                    onClick={() => setShowRestaurantPicker(false)}
                    className="text-[#8C6A52] text-xs font-bold hover:text-[#E8360A]"
                  >✕ Close</button>
                </div>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6A52]" />
                  <input
                    type="text"
                    value={restaurantSearch}
                    onChange={(e) => setRestaurantSearch(e.target.value)}
                    placeholder="Search restaurants…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFF8F0] border-2 text-sm font-semibold text-[#1A0A00] focus:outline-none focus:border-[#E8360A]/40 transition-colors"
                    style={{ borderColor: "rgba(232,54,10,0.1)" }}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {restaurantResults.length === 0 ? (
                    <p className="text-[#8C6A52] text-xs text-center py-3 font-medium">No restaurants found</p>
                  ) : restaurantResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setMatchedRestaurant(r); setShowRestaurantPicker(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-[#FDE8D0] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg,#FDE8D0,#FFF0D0)" }}>🍽️</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1A0A00] text-xs truncate">{r.name}</p>
                        <p className="text-[#8C6A52] text-[10px]">{r.cuisine} · {r.avg_cost != null ? `₹${r.avg_cost} avg` : "—"}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowRestaurantPicker(false)}
                  className="w-full mt-3 py-2 rounded-xl text-[#8C6A52] text-xs font-bold hover:bg-[#FDE8D0] transition-colors"
                >Skip — Continue without restaurant</button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A0A00] text-base">{dishes.length} item{dishes.length !== 1 ? "s" : ""} found</h3>
              <button
                onClick={addDish}
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
                      placeholder="Dish name"
                      className="w-full font-bold text-[#1A0A00] text-sm bg-transparent focus:outline-none border-b-2 border-transparent focus:border-[#E8360A]/40 transition-colors pb-0.5"
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[#8C6A52] text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={d.price}
                          onChange={(e) => updateDish(idx, "price", Number(e.target.value))}
                          aria-label="Price"
                          className="text-[#E8360A] font-black text-sm bg-transparent focus:outline-none w-16"
                        />
                      </div>
                      <div className="flex items-center gap-1 border-l pl-3" style={{ borderColor: "rgba(232,54,10,0.15)" }}>
                        <span className="text-[#8C6A52] text-xs">×</span>
                        <input
                          type="number"
                          min="1"
                          value={d.qty || 1}
                          onChange={(e) => updateDish(idx, "qty", Math.max(1, Number(e.target.value)))}
                          aria-label="Quantity"
                          className="text-[#4A2E1A] font-bold text-sm bg-transparent focus:outline-none w-8"
                        />
                        <span className="text-[#8C6A52] text-[10px]">qty</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDish(idx)}
                    aria-label="Remove dish"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#F9C9A0] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-5 flex items-center justify-between mb-6 border-2"
              style={{ background: "#FDE8D0", borderColor: "rgba(232,54,10,0.15)" }}
            >
              <span className="text-[#4A2E1A] font-bold text-sm">Total Amount</span>
              <span className="font-display font-black text-2xl text-[#E8360A]">₹{billTotal}</span>
            </div>

            <button
              onClick={handleRate}
              disabled={savingBill}
              className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              {savingBill ? "Saving…" : <>Rate Your Meal <Star fill="currentColor" size={18} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
