import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { t, s } from "../theme";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: "8%",
      overflow: "hidden",
    }}>
      {/* Full screen background image */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/gym-bg.png')",
        backgroundSize: "auto 120%",
        backgroundPosition: "left 80%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0a0a0f",
        zIndex: 0,
      }} />

      {/* Subtle dark overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 1,
      }} />

      {/* Form Card */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 400,
        background: "rgba(13,13,20,0.15)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "36px 28px",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💪</div>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>GymLog</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>Track. Progress. Dominate.</p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
          {["Login", "Register"].map((tab) => (
            <button key={tab} onClick={() => { setIsLogin(tab === "Login"); setError(""); }}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: (isLogin ? tab === "Login" : tab === "Register") ? t.accent : "transparent", color: (isLogin ? tab === "Login" : tab === "Register") ? "#000" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <div>
              <label style={{ ...s.label, color: "rgba(255,255,255,0.55)" }}>Full Name</label>
              <input style={{ ...s.input, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)" }} name="name" placeholder="Rahul Sharma" value={form.name} onChange={handle} />
            </div>
          )}
          <div>
            <label style={{ ...s.label, color: "rgba(255,255,255,0.55)" }}>Email</label>
            <input style={{ ...s.input, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)" }} name="email" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={handle} />
          </div>
          <div>
            <label style={{ ...s.label, color: "rgba(255,255,255,0.55)" }}>Password</label>
            <input style={{ ...s.input, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)" }} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
              onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          {error && <div style={{ color: t.red, fontSize: 13, textAlign: "center", background: "rgba(255,71,87,0.1)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
          <button style={{ ...s.btn, marginTop: 4, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login →" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}
