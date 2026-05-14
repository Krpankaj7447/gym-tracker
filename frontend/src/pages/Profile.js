import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { t, s } from "../theme";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [showMeasForm, setShowMeasForm] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", age: user?.age || "", height: user?.height || "", weight: user?.weight || "", gender: user?.gender || "", goal: user?.goal || "general" });
  const [measForm, setMeasForm] = useState({ weight: "", chest: "", waist: "", hips: "", biceps: "", thighs: "", shoulders: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/measurements").then((r) => setMeasurements(r.data)).catch(console.error);
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", profileForm);
      updateUser(data);
      setEditProfile(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const saveMeasurement = async () => {
    const filled = Object.fromEntries(Object.entries(measForm).filter(([, v]) => v !== "").map(([k, v]) => [k, Number(v)]));
    if (!Object.keys(filled).length) return;
    await api.post("/measurements", filled);
    const r = await api.get("/measurements");
    setMeasurements(r.data);
    setShowMeasForm(false);
    setMeasForm({ weight: "", chest: "", waist: "", hips: "", biceps: "", thighs: "", shoulders: "" });
  };

  const deleteMeasurement = async (id) => {
    await api.delete(`/measurements/${id}`);
    setMeasurements(measurements.filter((m) => m._id !== id));
  };

  const latest = measurements[0];
  const prev = measurements[1];
  const diff = (field) => latest && prev && latest[field] && prev[field] ? (latest[field] - prev[field]).toFixed(1) : null;

  const measFields = ["weight", "chest", "waist", "hips", "biceps", "thighs", "shoulders"];
  const goals = { muscle_gain: "💪 Muscle Gain", fat_loss: "🔥 Fat Loss", strength: "🏆 Strength", general: "⚡ General Fitness" };

  return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Profile</div>
        <button onClick={logout} style={{ background: "none", border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "6px 12px", color: t.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Logout</button>
      </div>

      <div style={{ padding: 16 }}>
        {/* Avatar + Info */}
        <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #00ff87, #00cc6a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#000", flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: t.text }}>{user?.name}</div>
            <div style={{ color: t.textMuted, fontSize: 13 }}>{user?.email}</div>
            <div style={{ color: t.accent, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{goals[user?.goal] || "⚡ General Fitness"}</div>
          </div>
          <button onClick={() => setEditProfile(!editProfile)} style={s.btnSmall}>{editProfile ? "Cancel" : "Edit"}</button>
        </div>

        {/* Edit Profile */}
        {editProfile && (
          <div style={{ ...s.card, border: `1px solid ${t.accent}44` }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>Edit Profile</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={s.label}>Name</label>
                <input style={s.input} value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={s.label}>Age</label>
                  <input style={s.input} type="number" placeholder="25" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} />
                </div>
                <div>
                  <label style={s.label}>Gender</label>
                  <select style={s.input} value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Height (cm)</label>
                  <input style={s.input} type="number" placeholder="175" value={profileForm.height} onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })} />
                </div>
                <div>
                  <label style={s.label}>Weight (kg)</label>
                  <input style={s.input} type="number" placeholder="70" value={profileForm.weight} onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={s.label}>Goal</label>
                <select style={s.input} value={profileForm.goal} onChange={(e) => setProfileForm({ ...profileForm, goal: e.target.value })}>
                  <option value="muscle_gain">💪 Muscle Gain</option>
                  <option value="fat_loss">🔥 Fat Loss</option>
                  <option value="strength">🏆 Strength</option>
                  <option value="general">⚡ General Fitness</option>
                </select>
              </div>
              <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={saveProfile}>{saving ? "Saving..." : "Save Profile"}</button>
            </div>
          </div>
        )}

        {/* Body Stats */}
        {(user?.height || user?.weight || user?.age) && (
          <div style={s.card}>
            <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 12 }}>Body Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ l: "Age", v: user?.age ? `${user.age}y` : "—" }, { l: "Height", v: user?.height ? `${user.height}cm` : "—" }, { l: "Weight", v: user?.weight ? `${user.weight}kg` : "—" }].map((st) => (
                <div key={st.l} style={{ background: "#0f0f18", borderRadius: 10, padding: "10px", textAlign: "center", border: `1px solid ${t.cardBorder}` }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: t.accent }}>{st.v}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Measurements */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Body Measurements</div>
          <button onClick={() => setShowMeasForm(!showMeasForm)} style={s.btnSmall}>+ Update</button>
        </div>

        {showMeasForm && (
          <div style={{ ...s.card, border: `1px solid ${t.accent}44`, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>Add Measurement</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {measFields.map((f) => (
                <div key={f}>
                  <label style={s.label}>{f.charAt(0).toUpperCase() + f.slice(1)} (cm/kg)</label>
                  <input style={s.input} type="number" placeholder="0" value={measForm[f]} onChange={(e) => setMeasForm({ ...measForm, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={s.btn} onClick={saveMeasurement}>Save</button>
              <button style={s.btnOutline} onClick={() => setShowMeasForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {latest ? (
          <div style={s.card}>
            <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 12 }}>
              Last updated: {new Date(latest.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {measFields.filter((f) => latest[f]).map((f) => {
                const d = diff(f);
                return (
                  <div key={f} style={{ background: "#0f0f18", borderRadius: 10, padding: "10px 12px", border: `1px solid ${t.cardBorder}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 12, color: t.textMuted }}>{f.charAt(0).toUpperCase() + f.slice(1)}</div>
                      {d && <span style={{ fontSize: 11, color: Number(d) > 0 ? (f === "waist" || f === "hips" ? t.red : t.accent) : (f === "waist" || f === "hips" ? t.accent : t.red), fontWeight: 600 }}>{Number(d) > 0 ? "+" : ""}{d}</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginTop: 2 }}>{latest[f]} {f === "weight" ? "kg" : "cm"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ ...s.card, textAlign: "center", padding: 24, color: t.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📏</div>
            No measurements yet. Add your first one!
          </div>
        )}

        {/* History */}
        {measurements.length > 1 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 8 }}>History</div>
            {measurements.slice(1).map((m) => (
              <div key={m._id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                <div style={{ fontSize: 13, color: t.textMuted }}>{new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {m.weight && <span style={{ fontSize: 13, color: t.text }}>{m.weight}kg</span>}
                  <button onClick={() => deleteMeasurement(m._id)} style={{ background: "none", border: "none", color: t.red, cursor: "pointer", fontSize: 13 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
