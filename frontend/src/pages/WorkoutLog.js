import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { t, s } from "../theme";

// ── Log List ──────────────────────────────────────────────────
export function LogList() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/logs").then((r) => setLogs(r.data)).catch(console.error);
  }, []);

  return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Workout Log</div>
        <button onClick={() => navigate("/log/new")} style={{ background: t.accentGlow, border: `1px solid ${t.accent}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, color: t.accent }}>+</button>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 12 }}>{logs.length} workouts logged</div>
        {logs.length === 0 && (
          <div style={{ ...s.card, textAlign: "center", padding: 32, color: t.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏋️</div>
            No workouts yet!<br />
            <button onClick={() => navigate("/log/new")} style={{ ...s.btnSmall, marginTop: 12 }}>Log First Workout</button>
          </div>
        )}
        {logs.map((log) => (
          <div key={log._id} onClick={() => navigate(`/log/${log._id}`)} style={{ ...s.card, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>{log.day} Day</div>
                  <span style={s.badge}>Done ✓</span>
                </div>
                <div style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>
                  {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <span style={{ color: t.textDim, fontSize: 18 }}>›</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              {[
                { l: "Exercises", v: log.exercises?.length },
                { l: "Sets", v: log.exercises?.reduce((a, e) => a + (e.sets?.length || 0), 0) },
                { l: "Volume", v: `${log.exercises?.reduce((a, e) => a + e.sets?.reduce((b, s) => b + (s.reps * s.weight), 0), 0)}kg` },
              ].map((st) => (
                <div key={st.l}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: t.accent }}>{st.v} </span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>{st.l}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Log Detail ────────────────────────────────────────────────
export function LogDetail() {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/logs/${id}`).then((r) => setLog(r.data)).catch(() => navigate("/log"));
  }, [id, navigate]);

  const deleteLog = async () => {
    if (!window.confirm("Delete this log?")) return;
    await api.delete(`/logs/${id}`);
    navigate("/log");
  };

  if (!log) return <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted }}>Loading...</div>;

  return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <button onClick={() => navigate("/log")} style={{ background: "none", border: "none", cursor: "pointer", color: t.text, fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>← Back</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>{log.day} Day</div>
        <button onClick={deleteLog} style={{ background: "none", border: "none", color: t.red, cursor: "pointer", fontSize: 13 }}>Delete</button>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 16 }}>
          {new Date(log.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {log.duration ? ` · ${log.duration} min` : ""}
        </div>
        {log.exercises?.map((ex, i) => (
          <div key={i} style={s.card}>
            <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 12 }}>{ex.name}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["Set", "Reps", "Weight"].map((h) => (
                <div key={h} style={{ flex: 1, textAlign: "center", fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{h}</div>
              ))}
            </div>
            {ex.sets?.map((set, si) => (
              <div key={si} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {[si + 1, set.reps, set.weight ? `${set.weight}kg` : "BW"].map((v, vi) => (
                  <div key={vi} style={{ flex: 1, background: "#0f0f18", borderRadius: 8, padding: "8px", textAlign: "center", fontSize: 14, fontWeight: vi === 0 ? 400 : 600, color: vi === 0 ? t.textMuted : t.text }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New Log ───────────────────────────────────────────────────
export function NewLog() {
  const navigate = useNavigate();
  const [splits, setSplits] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [day, setDay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("");
  const [logExercises, setLogExercises] = useState([{ name: "", sets: [{ reps: "", weight: "" }] }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/splits"), api.get("/exercises")]).then(([sp, ex]) => {
      setSplits(sp.data);
      setExercises(ex.data);
      if (sp.data[0]) setDay(sp.data[0].name);
    });
  }, []);

  const addExercise = () => setLogExercises([...logExercises, { name: "", sets: [{ reps: "", weight: "" }] }]);
  const removeExercise = (i) => setLogExercises(logExercises.filter((_, idx) => idx !== i));
  const updateExName = (i, val) => { const arr = [...logExercises]; arr[i].name = val; setLogExercises(arr); };
  const addSet = (i) => { const arr = [...logExercises]; arr[i].sets.push({ reps: "", weight: "" }); setLogExercises(arr); };
  const removeSet = (i, si) => { const arr = [...logExercises]; arr[i].sets = arr[i].sets.filter((_, idx) => idx !== si); setLogExercises(arr); };
  const updateSet = (i, si, field, val) => { const arr = [...logExercises]; arr[i].sets[si][field] = val; setLogExercises(arr); };

  const save = async () => {
    if (!day) return setError("Select a day");
    const cleaned = logExercises.filter((e) => e.name).map((e) => ({ name: e.name, sets: e.sets.filter((s) => s.reps).map((s, i) => ({ setNumber: i + 1, reps: Number(s.reps), weight: Number(s.weight) || 0 })) }));
    if (!cleaned.length) return setError("Add at least one exercise");
    setSaving(true);
    try {
      await api.post("/logs", { day, date, duration: duration ? Number(duration) : undefined, exercises: cleaned });
      navigate("/log");
    } catch (e) { setError(e.response?.data?.message || "Error saving"); }
    finally { setSaving(false); }
  };

  return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <button onClick={() => navigate("/log")} style={{ background: "none", border: "none", cursor: "pointer", color: t.text, fontSize: 15 }}>← Back</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Log Workout</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ padding: 16 }}>
        <div style={s.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={s.label}>Day</label>
              <select style={s.input} value={day} onChange={(e) => setDay(e.target.value)}>
                {splits.map((sp) => <option key={sp._id}>{sp.name}</option>)}
                <option>Rest</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Date</label>
              <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={s.label}>Duration (min) — optional</label>
            <input style={s.input} type="number" placeholder="60" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>

        {logExercises.map((ex, i) => (
          <div key={i} style={{ ...s.card, border: `1px solid ${t.accent}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: t.accent, fontWeight: 600 }}>Exercise {i + 1}</div>
              {logExercises.length > 1 && <button onClick={() => removeExercise(i)} style={{ background: "none", border: "none", color: t.red, cursor: "pointer", fontSize: 13 }}>Remove</button>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Exercise Name</label>
              <select style={s.input} value={ex.name} onChange={(e) => updateExName(i, e.target.value)}>
                <option value="">Select exercise</option>
                {exercises.map((e) => <option key={e._id}>{e.name}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: 6, marginBottom: 6, padding: "0 2px" }}>
              {["Set", "Reps", "Wt (kg)", ""].map((h) => <div key={h} style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textAlign: "center" }}>{h}</div>)}
            </div>
            {ex.sets.map((set, si) => (
              <div key={si} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: 6, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: t.textMuted }}>{si + 1}</div>
                <input style={{ ...s.input, padding: "10px 8px", textAlign: "center" }} type="number" placeholder="10" value={set.reps} onChange={(e) => updateSet(i, si, "reps", e.target.value)} />
                <input style={{ ...s.input, padding: "10px 8px", textAlign: "center" }} type="number" placeholder="0" value={set.weight} onChange={(e) => updateSet(i, si, "weight", e.target.value)} />
                <button onClick={() => removeSet(i, si)} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
            ))}
            <button onClick={() => addSet(i)} style={{ ...s.btnSmall, width: "100%", marginTop: 6 }}>+ Add Set</button>
          </div>
        ))}

        <button onClick={addExercise} style={{ ...s.btnOutline, marginBottom: 12 }}>+ Add Exercise</button>
        {error && <div style={{ color: t.red, fontSize: 13, marginBottom: 10, textAlign: "center" }}>{error}</div>}
        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Workout ✓"}
        </button>
      </div>
    </div>
  );
}
