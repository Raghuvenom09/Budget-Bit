import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any routes that require a logged-in user.
 * If not authenticated → redirect to /login, then come back after.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Still checking session — show nothing (avoids flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-lg animate-pulse"
            style={{ background: "linear-gradient(135deg, #E8360A, #FF9F1C)" }}
          >
            B
          </div>
          <p className="text-[#8C6A52] text-sm font-semibold">Loading…</p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
