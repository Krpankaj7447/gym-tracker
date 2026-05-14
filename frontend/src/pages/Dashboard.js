import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { t, s } from "../theme";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, streak: 0, thisWeek: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, logsRes, splitsRes] = await Promise.all([
          api.get("/logs/stats"),
          api.get("/logs"),
          api.get("/splits"),
        ]);
        setStats(statsRes.data);
        setRecentLogs(logsRes.data.slice(0, 2));
        setSplits(splitsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long" });
  const todaySplit = splits.find((sp) => sp.days?.some((d) => d.toLowerCase().includes(today.toLowerCase()))) || splits[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg, color: t.textMuted }}>Loading...</div>;

  return (
    <div style={s.screen}>
      {/* Top Bar */}
      <div style={s.topBar}>
        <div>
          <div style={{ fontSize: 13, color: t.textMuted }}>{greeting} 💪</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{user?.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: t.accentGlow, border: `1px solid ${t.accent}`, borderRadius: 20, padding: "6px 12px" }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ color: t.accent, fontWeight: 700, fontSize: 14 }}>{stats.streak} days</span>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Today's Workout Card */}
        {todaySplit && (
          <div style={{ ...s.card, background: "linear-gradient(135deg, #0f1f0f, #0a1a0a)", border: `1px solid ${t.accent}33`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TODAY · {today.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>{todaySplit.name} Day 💪</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>{todaySplit.exercises?.length || 0} exercises</div>
              </div>
              <span style={s.badge}>Active</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {todaySplit.exercises?.slice(0, 3).map((ex) => (
                <div key={ex} style={{ background: "#0a2a1a", border: `1px solid ${t.accent}22`, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: t.accentDim }}>{ex}</div>
              ))}
            </div>
            <button style={s.btn} onClick={() => navigate("/log/new")}>Start Workout →</button>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[{ label: "Total Workouts", val: stats.total }, { label: "This Week", val: stats.thisWeek }, { label: "Day Streak", val: `${stats.streak}🔥` }].map((st) => (
            <div key={st.label} style={{ background: "#0f0f18", borderRadius: 12, padding: "12px 10px", flex: 1, border: `1px solid ${t.cardBorder}`, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>{st.val}</div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Logs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Recent Workouts</div>
          <button onClick={() => navigate("/log")} style={{ background: "none", border: "none", color: t.accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all →</button>
        </div>
        {recentLogs.length === 0 ? (
          <div style={{ ...s.card, textAlign: "center", color: t.textMuted, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏋️</div>
            No workouts yet. Log your first one!
          </div>
        ) : (
          recentLogs.map((log) => (
            <div key={log._id} onClick={() => navigate(`/log/${log._id}`)} style={{ ...s.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: t.text }}>{log.day} Day</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                  {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {log.exercises?.length} exercises
                </div>
              </div>
              <span style={{ color: t.accent, fontSize: 13, fontWeight: 600 }}>
                {log.exercises?.reduce((a, e) => a + (e.sets?.length || 0), 0)} sets →
              </span>
            </div>
          ))
        )}

        {/* Quick Links */}
        <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 10, marginTop: 4 }}>Quick Access</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Exercise Library", sub: "16+ exercises", path: "/splits" },
            { label: "My Splits", sub: `${splits.length} splits`, path: "/splits" },
            { label: "Body Stats", sub: "Measurements", path: "/profile" },
            { label: "Log Workout", sub: "Add new log", path: "/log/new" },
          ].map((item) => (
            <div key={item.label} onClick={() => navigate(item.path)} style={{ ...s.card, cursor: "pointer" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{item.label}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
