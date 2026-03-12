import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera, Image as ImageIcon, Receipt, Clock, Zap,
  CheckCircle2, Trash2, Star,
} from "lucide-react";
import SectionHead from "../components/SectionHead";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [stage, setStage] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [billImageUrl, setBillImageUrl] = useState(null);
  const [savingBill, setSavingBill] = useState(false);
  const mockExtracted = [
    { name: "Butter Chicken", price: 280 },
    { name: "Garlic Naan", price: 60 },
    { name: "Dal Makhani", price: 180 },
    { name: "Lassi", price: 80 },
  ];
  const [dishes, setDishes] = useState(mockExtracted);

  const handleFileSelected = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setStage("preview");
    // Upload image in background
    if (user) {
      try {
        const url = await api.storage.uploadBillImage(user.id, file);
        setBillImageUrl(url);
      } catch (e) {
        console.error("Image upload failed:", e);
      }
    }
    setTimeout(() => setStage("extracted"), 1300);
  };

  const handleUpload = () => {
    // fallback for demo click (no real file)
    setStage("preview");
    setTimeout(() => setStage("extracted"), 1300);
  };

  const updateDish = (idx, field, val) => setDishes((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d));
  const removeDish = (idx) => setDishes((prev) => prev.filter((_, i) => i !== idx));

  const handleRate = async () => {
    // Save bill to Supabase then go to rate page
    if (user) {
      setSavingBill(true);
      try {
        await api.bills.create({
          user_id: user.id,
          amount: dishes.reduce((a, d) => a + d.price, 0),
          image_url: billImageUrl,
          dishes: dishes.map((d) => d.name),
        });
      } catch (e) {
        console.error("Bill save failed:", e);
      } finally {
        setSavingBill(false);
      }
    }
    navigate("/rate", { state: { dishes } });
  };

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
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files[0])}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
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
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full boop" style={{ background: "#E8360A", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {stage === "extracted" && (
          <div className="stagger">
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

            <div
              className="rounded-2xl p-5 flex items-center justify-between mb-6 border-2"
              style={{ background: "#FDE8D0", borderColor: "rgba(232,54,10,0.15)" }}
            >
              <span className="text-[#4A2E1A] font-bold text-sm">Total Amount</span>
              <span className="font-display font-black text-2xl text-[#E8360A]">₹{dishes.reduce((a, d) => a + d.price, 0)}</span>
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
