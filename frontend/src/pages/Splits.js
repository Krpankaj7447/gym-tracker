import { useState, useEffect } from "react";
import api from "../api";
import { t, s } from "../theme";

export default function Splits() {
  const [splits, setSplits] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [showAddSplit, setShowAddSplit] = useState(false);
  const [showAddEx, setShowAddEx] = useState(false);
  const [splitForm, setSplitForm] = useState({ name: "", days: "" });
  const [exForm, setExForm] = useState({ name: "", muscle: "", type: "Compound" });
  const [error, setError] = useState("");

  const load = async () => {
    const [sp, ex] = await Promise.all([api.get("/splits"), api.get("/exercises")]);
    setSplits(sp.data);
    setExercises(ex.data);
  };

  useEffect(() => { load(); }, []);

  const saveSplit = async () => {
    if (!splitForm.name) return setError("Name required");
    await api.post("/splits", { name: splitForm.name, days: splitForm.days.split(",").map((d) => d.trim()).filter(Boolean) });
    setShowAddSplit(false); setSplitForm({ name: "", days: "" }); load();
  };

  const deleteSplit = async (id) => {
    if (!window.confirm("Delete split?")) return;
    await api.delete(`/splits/${id}`); load();
  };

  const saveEx = async () => {
    if (!exForm.name || !exForm.muscle) return setError("Name and muscle required");
    await api.post("/exercises", exForm);
    setShowAddEx(false); setExForm({ name: "", muscle: "", type: "Compound" }); load();
  };

  const deleteEx = async (id) => {
    await api.delete(`/exercises/${id}`); load();
  };

  const muscles = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"];

  return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Splits & Exercises</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Splits Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>My Splits</div>
          <button onClick={() => setShowAddSplit(!showAddSplit)} style={s.btnSmall}>+ Add Split</button>
        </div>

        {showAddSplit && (
          <div style={{ ...s.card, border: `1px solid ${t.accent}44`, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>New Split</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={s.label}>Split Name</label>
                <input style={s.input} placeholder="e.g. Chest & Triceps" value={splitForm.name} onChange={(e) => setSplitForm({ ...splitForm, name: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Days (comma separated)</label>
                <input style={s.input} placeholder="Monday, Thursday" value={splitForm.days} onChange={(e) => setSplitForm({ ...splitForm, days: e.target.value })} />
              </div>
              {error && <div style={{ color: t.red, fontSize: 13 }}>{error}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button style={s.btn} onClick={saveSplit}>Save</button>
                <button style={s.btnOutline} onClick={() => setShowAddSplit(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {splits.map((sp) => (
          <div key={sp._id} style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>{sp.name}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.textMuted }}>{sp.days?.join(", ")}</span>
                {!sp.isDefault && <button onClick={() => deleteSplit(sp._id)} style={{ background: "none", border: "none", color: t.red, cursor: "pointer", fontSize: 12 }}>✕</button>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sp.exercises?.map((ex) => (
                <div key={ex} style={{ background: "#1a1a28", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: t.textDim }}>{ex}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Exercise Library */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 10px" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Exercise Library</div>
          <button onClick={() => setShowAddEx(!showAddEx)} style={s.btnSmall}>+ Custom</button>
        </div>

        {showAddEx && (
          <div style={{ ...s.card, border: `1px solid ${t.accent}44`, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>Add Custom Exercise</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={s.label}>Exercise Name</label>
                <input style={s.input} placeholder="e.g. Cable Fly" value={exForm.name} onChange={(e) => setExForm({ ...exForm, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={s.label}>Muscle</label>
                  <select style={s.input} value={exForm.muscle} onChange={(e) => setExForm({ ...exForm, muscle: e.target.value })}>
                    <option value="">Select</option>
                    {muscles.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Type</label>
                  <select style={s.input} value={exForm.type} onChange={(e) => setExForm({ ...exForm, type: e.target.value })}>
                    <option>Compound</option><option>Isolation</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={s.btn} onClick={saveEx}>Save</button>
                <button style={s.btnOutline} onClick={() => setShowAddEx(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {exercises.map((ex) => (
          <div key={ex._id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{ex.muscle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: ex.type === "Compound" ? t.accent : t.yellow, background: ex.type === "Compound" ? t.accentGlow : "rgba(255,211,42,0.1)", border: `1px solid ${ex.type === "Compound" ? t.accent : t.yellow}44`, borderRadius: 6, padding: "3px 8px", fontWeight: 600 }}>{ex.type}</span>
              {ex.isCustom && <button onClick={() => deleteEx(ex._id)} style={{ background: "none", border: "none", color: t.red, cursor: "pointer", fontSize: 13 }}>✕</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
