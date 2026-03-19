import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(trimmedName, email, password);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center card-warm p-10">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl font-black text-[#1A0A00] mb-3">Account Created!</h2>
          <p className="text-[#8C6A52] text-sm mb-6">
            Check your email <strong>{email}</strong> for a confirmation link, then sign in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #E8360A, #FF9F1C)" }}
            >
              B
            </div>
            <span className="font-display font-black text-3xl tracking-tight text-[#1A0A00]">
              Budget<span style={{ color: "#E8360A" }}>Bit</span>
            </span>
          </div>
          <p className="text-[#8C6A52] text-sm font-medium">Create your account and start saving!</p>
        </div>

        {/* Card */}
        <div className="card-warm p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm font-semibold text-red-700 border-2" style={{ background: "#FEE2E2", borderColor: "rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider block mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-[#1A0A00] placeholder-[#8C6A52]/50 outline-none border-2 transition-all focus:border-[#E8360A]/50"
                style={{ background: "#FFF8F0", borderColor: "rgba(232,54,10,0.12)" }}
              />
            </div>

            <div>
              <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-[#1A0A00] placeholder-[#8C6A52]/50 outline-none border-2 transition-all focus:border-[#E8360A]/50"
                style={{ background: "#FFF8F0", borderColor: "rgba(232,54,10,0.12)" }}
              />
            </div>

            <div>
              <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl text-sm font-medium text-[#1A0A00] placeholder-[#8C6A52]/50 outline-none border-2 transition-all focus:border-[#E8360A]/50"
                  style={{ background: "#FFF8F0", borderColor: "rgba(232,54,10,0.12)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6A52] hover:text-[#E8360A] transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider block mb-2">Confirm Password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-[#1A0A00] placeholder-[#8C6A52]/50 outline-none border-2 transition-all focus:border-[#E8360A]/50"
                style={{ background: "#FFF8F0", borderColor: "rgba(232,54,10,0.12)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              {loading ? (
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/80 boop" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8C6A52] text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#E8360A] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
