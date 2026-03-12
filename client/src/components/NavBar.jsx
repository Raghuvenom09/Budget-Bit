import { Home, Upload, Compass, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { profile } = useAuth();

  const items = [
    { to: "/",        icon: <Home size={17} />,    label: "Home"        },
    { to: "/upload",  icon: <Upload size={17} />,  label: "Upload Bill" },
    { to: "/explore", icon: <Compass size={17} />, label: "Explore"     },
  ];

  const linkCls = ({ isActive }) =>
    `px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all relative ${
      isActive
        ? "text-[#E8360A] bg-[#E8360A]/8 nav-dot"
        : "text-[#8C6A52] hover:text-[#1A0A00] hover:bg-[#FDE8D0]/60"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: "rgba(255,248,240,0.88)", backdropFilter: "blur(20px)", borderColor: "rgba(232,54,10,0.10)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-black text-lg shadow-md"
            style={{ background: "linear-gradient(135deg, #E8360A, #FF9F1C)" }}
          >
            B
          </div>
          <span className="font-display font-black text-xl tracking-tight text-[#1A0A00]">
            Budget<span style={{ color: "#E8360A" }}>Bit</span>
          </span>
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkCls}>
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </NavLink>
          ))}

          {profile ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `ml-2 pl-3 border-l flex items-center gap-2 text-sm font-semibold transition-all ${
                  isActive ? "text-[#E8360A]" : "text-[#8C6A52] hover:text-[#1A0A00]"
                }`
              }
              style={{ borderColor: "rgba(232,54,10,0.15)" }}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ background: "#FDE8D0", borderColor: isActive ? "#E8360A" : "transparent" }}
                  >
                    <User size={16} style={{ color: "#E8360A" }} />
                  </div>
                  <span className="hidden sm:block">{profile.name?.split(" ")[0] || "Profile"}</span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="ml-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#E8360A,#FF9F1C)" }}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
