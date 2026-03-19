import { Component, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Lazy-loaded pages — each route becomes its own JS chunk ─────────────────
const HomePage       = lazy(() => import("./pages/HomePage"));
const ExplorePage    = lazy(() => import("./pages/ExplorePage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));
const LoginPage      = lazy(() => import("./pages/LoginPage"));
const RegisterPage   = lazy(() => import("./pages/RegisterPage"));
const UploadPage     = lazy(() => import("./pages/UploadPage"));
const ProfilePage    = lazy(() => import("./pages/ProfilePage"));
const RatePage       = lazy(() => import("./pages/RatePage"));

// ─── Chunk-loading fallback ───────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{ borderColor: "rgba(232,54,10,0.15)", borderTopColor: "#E8360A" }}
        />
        <p className="text-[#8C6A52] text-sm font-semibold">Loading…</p>
      </div>
    </div>
  );
}

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--cream)" }}>
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="font-display text-3xl font-black text-[#1A0A00] mb-3">Something went wrong</h2>
            <p className="text-[#8C6A52] text-sm mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-block px-8 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Shared toast options ──────────────────────────────────────────────────────
const toastOptions = {
  style: {
    background: "#1A0A00",
    color: "#FFF8F0",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    borderRadius: 16,
  },
};

// ─── Layout Wrapper ───────────────────────────────────────────────────────────
function Layout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Outlet />
      </main>
      <Toaster position="bottom-center" toastOptions={toastOptions} />
    </div>
  );
}

// ─── Minimal layout (no NavBar — for rate page) ─────────────────────────────
function MinimalLayout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Outlet />
      </main>
      <Toaster position="bottom-center" toastOptions={toastOptions} />
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="font-display text-4xl font-black text-[#1A0A00] mb-3">Page Not Found</h2>
        <p className="text-[#8C6A52] text-sm mb-8">This page doesn't exist. Let's get you back on track.</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-2xl font-bold text-white text-sm shadow-xl hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* Suspense wraps all lazy routes — shows PageLoader during chunk fetch */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public pages — with NavBar */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="restaurant/:id" element={<RestaurantPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Protected pages — with NavBar */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="upload" element={<UploadPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Protected pages — no NavBar */}
          <Route element={<MinimalLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="rate" element={<RatePage />} />
            </Route>
          </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
