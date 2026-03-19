import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase.js";
import { Eye, EyeOff, LogIn, Mail, KeyRound, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // ── Password-recovery mode — set when Supabase redirect lands here ──────────
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword]   = useState("");
  const [pwUpdated, setPwUpdated]       = useState(false);

  const from = location.state?.from?.pathname || "/";

  // Detect Supabase PASSWORD_RECOVERY event from the email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setForgotMode(false);
        setResetSent(false);
        setError("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) { setError("Enter your email address above first."); return; }
    setError("");
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err) {
      setError(err?.message || "Failed to send reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setPwUpdated(true);
      // Sign out so user logs in fresh with new password
      await supabase.auth.signOut();
    } catch (err) {
      setError(err?.message || "Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const Logo = () => (
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2.5 mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #E8360A, #FF9F1C)" }}
        >B</div>
        <span className="font-display font-black text-3xl tracking-tight text-[#1A0A00]">
          Budget<span style={{ color: "#E8360A" }}>Bit</span>
        </span>
      </div>
    </div>
  );

  // ── Set New Password screen ────────────────────────────────────────────────
  if (recoveryMode) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Logo />
          <div className="card-warm p-8">
            {pwUpdated ? (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
                <p className="font-bold text-[#1A0A00] text-lg mb-2">Password updated!</p>
                <p className="text-[#8C6A52] text-sm mb-6">Sign in with your new password.</p>
                <button
                  onClick={() => { setPwUpdated(false); setRecoveryMode(false); setNewPassword(""); }}
                  className="px-8 py-3 rounded-2xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
                >Sign In</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FDE8D0" }}>
                    <KeyRound size={18} style={{ color: "#E8360A" }} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1A0A00] text-base">Set New Password</p>
                    <p className="text-[#8C6A52] text-xs">Choose a strong password for your account.</p>
                  </div>
                </div>
                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm font-semibold text-red-700 border-2" style={{ background: "#FEE2E2", borderColor: "rgba(239,68,68,0.2)" }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSetNewPassword} className="space-y-5">
                  <div>
                    <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider block mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                      <><KeyRound size={18} /> Update Password</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Normal login / forgot / reset-sent screens ────────────────────────────
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Logo />
        <p className="text-center text-[#8C6A52] text-sm font-medium -mt-6 mb-10">Welcome back! Sign in to continue.</p>

        <div className="card-warm p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm font-semibold text-red-700 border-2" style={{ background: "#FEE2E2", borderColor: "rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <p className="font-bold text-[#1A0A00] text-base mb-2">Reset link sent!</p>
              <p className="text-[#8C6A52] text-sm mb-6">Check <strong>{email}</strong> for a password reset link.</p>
              <button
                onClick={() => { setResetSent(false); setForgotMode(false); }}
                className="text-[#E8360A] font-bold text-sm hover:underline"
              >Back to Sign In</button>
            </div>
          ) : (
            <form onSubmit={forgotMode ? handleForgotPassword : handleSubmit} className="space-y-5">
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

              {!forgotMode && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[#4A2E1A] text-xs font-bold uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setError(""); }}
                      className="text-[#8C6A52] text-xs font-semibold hover:text-[#E8360A] transition-colors"
                    >Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
              )}

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
                ) : forgotMode ? (
                  <><Mail size={18} /> Send Reset Link</>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </button>

              {forgotMode && (
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setError(""); }}
                  className="w-full text-center text-[#8C6A52] text-sm font-semibold hover:text-[#E8360A] transition-colors"
                >← Back to Sign In</button>
              )}
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-[#8C6A52] text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#E8360A] font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
