export const t = {
  bg: "#0a0a0f",
  card: "#13131a",
  cardBorder: "#1e1e2e",
  accent: "#00ff87",
  accentDim: "#00cc6a",
  accentGlow: "rgba(0,255,135,0.12)",
  red: "#ff4757",
  yellow: "#ffd32a",
  blue: "#00d2ff",
  text: "#e8e8f0",
  textMuted: "#6b6b80",
  textDim: "#9999aa",
};

export const s = {
  card: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 12 },
  input: { background: "#1a1a24", border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: "13px 16px", color: t.text, fontSize: 15, width: "100%", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  label: { fontSize: 13, color: t.textMuted, marginBottom: 6, display: "block", fontWeight: 500 },
  btn: { background: t.accent, color: "#000", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" },
  btnOutline: { background: "transparent", color: t.accent, border: `1.5px solid ${t.accent}`, borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" },
  btnSmall: { background: t.accentGlow, border: `1px solid ${t.accent}`, color: t.accent, borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: `1px solid ${t.cardBorder}`, background: t.bg, position: "sticky", top: 0, zIndex: 10 },
  screen: { minHeight: "100vh", paddingBottom: 80 },
  badge: { background: "rgba(0,255,135,0.12)", border: `1px solid ${t.accent}`, color: t.accent, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 },
};
