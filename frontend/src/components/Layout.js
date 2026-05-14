import { useLocation, useNavigate } from "react-router-dom";
import { t } from "../theme";

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/log", label: "Log", icon: "📋" },
  { path: "/splits", label: "Splits", icon: "💪" },
  { path: "/profile", label: "Profile", icon: "👤" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = location.pathname.startsWith("/log/") && location.pathname !== "/log/";

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.text }}>
      {children}
      {!hideNav && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#0f0f18", borderTop: `1px solid ${t.cardBorder}`, display: "flex", padding: "8px 0 14px", zIndex: 20 }}>
          {navItems.map((item) => {
            const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <div key={item.path} onClick={() => navigate(item.path)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 0" }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 10, color: active ? t.accent : t.textMuted, fontWeight: active ? 700 : 400 }}>{item.label}</span>
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: t.accent }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
