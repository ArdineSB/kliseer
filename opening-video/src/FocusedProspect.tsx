import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type Factor = { label: string; value: number };
const factors: Factor[] = [
  { label: "Keyword match", value: 5 },
  { label: "Signal freshness", value: 5 },
  { label: "Service area", value: 5 },
  { label: "Target fit", value: 1 },
];
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const reveal = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const FocusedProspect = () => {
  const frame = useCurrentFrame();
  const cardIn = reveal(frame, 12, 48);
  const cardOpacity = interpolate(frame, [0, 20, 850, 900], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const cardY = interpolate(frame, [0, 60], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const score = Math.round(16 * reveal(frame, 165, 72));
  const signalOpacity = reveal(frame, 650, 40);

  return (
    <AbsoluteFill style={{ background: "#f4f2ef", color: "#26232b", justifyContent: "center", alignItems: "center", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ position: "absolute", top: 66, left: 92, color: "#7b7781", fontSize: 15, fontWeight: 700, letterSpacing: ".18em" }}>KLIESEER <span style={{ color: "#b9b5be", margin: "0 12px" }}>/</span> PROSPECT SIGNAL</div>
      <section style={{ width: 1230, minHeight: 650, padding: "44px 52px 0", boxSizing: "border-box", border: "1px solid #e4e0dc", borderRadius: 24, background: "#fff", boxShadow: "0 34px 90px rgba(37,31,46,.11)", opacity: cardOpacity, transform: `translateY(${cardY}px) scale(${0.97 + cardIn * 0.03})` }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 26, borderBottom: "1px solid #ece9e6" }}>
          <span style={{ color: "#85818a", fontSize: 14, fontWeight: 750, letterSpacing: ".15em" }}>SELECTED PROSPECT</span>
          <span style={{ padding: "10px 16px", borderRadius: 99, background: "#f2f0ee", color: "#625e68", fontSize: 14, fontWeight: 650 }}>Historical sample · November 7, 2026</span>
        </header>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px 0 30px" }}>
          <div style={{ opacity: reveal(frame, 55, 36), transform: `translateY(${(1 - reveal(frame, 55, 36)) * 14}px)` }}>
            <h1 style={{ margin: 0, fontSize: 42, letterSpacing: "-.045em", fontWeight: 680 }}>Hivolts Electrical Inc</h1>
            <p style={{ margin: "12px 0 0", color: "#77737c", fontSize: 18 }}>hivoltselectrical.com <span style={{ color: "#c5c1c8", padding: "0 8px" }}>·</span> Brooklyn, NY</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#928e98", fontSize: 13, fontWeight: 750, letterSpacing: ".16em" }}>OVERALL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}><strong style={{ fontSize: 58, letterSpacing: "-.06em", fontWeight: 650 }}>{score}<small style={{ color: "#99959d", fontSize: 26, fontWeight: 450 }}> / 20</small></strong><span style={{ padding: "8px 14px", borderRadius: 99, color: "#397959", background: "#e8f4ed", fontSize: 15, fontWeight: 750, opacity: reveal(frame, 260, 34) }}>TIER S</span></div>
          </div>
        </div>
        <div style={{ padding: "24px 0 30px", borderTop: "1px solid #ece9e6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#85818a", fontSize: 13, fontWeight: 750, letterSpacing: ".14em" }}>SCORE FACTORS <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0 }}>0–5 each</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 56px", marginTop: 28 }}>
            {factors.map((factor, index) => {
              const progress = reveal(frame, 340 + index * 58, 36);
              return <div key={factor.label} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 18, opacity: progress, transform: `translateY(${(1 - progress) * 12}px)`, color: "#55515c", fontSize: 18 }}>
                <span>{factor.label}</span><div style={{ display: "flex", gap: 7 }}>{Array.from({ length: 5 }, (_, dot) => <i key={dot} style={{ width: 12, height: 12, borderRadius: 20, background: dot < factor.value && frame > 370 + index * 58 ? "#8862c2" : "#e8e5e2" }} />)}</div><b style={{ color: "#38343e", fontSize: 17 }}>{factor.value}/5</b>
              </div>;
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 100, margin: "0 -52px", padding: "0 52px", borderTop: "1px solid #ece9e6", background: "#faf9f8", opacity: signalOpacity, transform: `translateY(${(1 - signalOpacity) * 12}px)` }}>
          <span style={{ width: 13, height: 13, flex: "none", border: "3px solid #9874cf", borderRadius: "50%", boxShadow: "0 0 0 5px #eee7fb" }} />
          <div><strong style={{ fontSize: 18 }}>NYC DOB signal</strong><p style={{ margin: "7px 0 0", color: "#706c75", fontSize: 16 }}>Temporary power and generator-hoist work · November 1, 2026</p></div>
          <span style={{ marginLeft: "auto", color: "#8060b0", fontSize: 13, fontWeight: 650 }}>B01483138-I1-EL</span>
        </div>
      </section>
      <div style={{ position: "absolute", bottom: 58, color: "#77737c", fontSize: 17, letterSpacing: ".01em", opacity: reveal(frame, 710, 36) }}>A public signal worth reviewing — not proof of purchase intent.</div>
    </AbsoluteFill>
  );
};
