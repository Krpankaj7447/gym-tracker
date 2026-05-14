import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { t } from "../theme";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: t.accent, fontSize: 24 }}>💪</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}
