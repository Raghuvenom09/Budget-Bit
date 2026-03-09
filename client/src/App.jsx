import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import RatePage from "./pages/RatePage";
import RestaurantPage from "./pages/RestaurantPage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ─── Layout Wrapper ───────────────────────────────────────────────────────────
function Layout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Outlet />
      </main>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1A0A00",
            color: "#FFF8F0",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            borderRadius: 16,
          },
        }}
      />
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
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — with NavBar */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="restaurant/:id" element={<RestaurantPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
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
    </BrowserRouter>
  );
}
