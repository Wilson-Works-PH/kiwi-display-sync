import type { ArtKind, ArtProps, ArtTheme } from "./scenarios";

/**
 * Draws a piece of signage content from a description — no stock imagery.
 * Sizes use container-query units, so the same art renders as a thumbnail
 * in the dashboard and full-bleed on a simulated screen. The parent must be
 * a `container-type: inline-size` box; DisplayWall and DashboardFrame are.
 */
const THEMES: Record<ArtTheme, { bg: string; fg: string; accent: string; soft: string; onAccent: string }> = {
  lime: { bg: "linear-gradient(135deg, #ceed7a 0%, #dcf09f 100%)", fg: "#2d0d29", accent: "#3d0d37", soft: "rgba(45,13,41,0.12)" , onAccent: "#f3f9d4" },
  plum: { bg: "linear-gradient(135deg, #3d0d37 0%, #54154d 100%)", fg: "#f3f9d4", accent: "#ceed7a", soft: "rgba(243,249,212,0.14)" , onAccent: "#2d0d29" },
  cream: { bg: "linear-gradient(135deg, #f3f9d4 0%, #ffffff 100%)", fg: "#2d0d29", accent: "#96507e", soft: "rgba(45,13,41,0.1)" , onAccent: "#ffffff" },
  leaf: { bg: "linear-gradient(135deg, #7fa060 0%, #c1d786 100%)", fg: "#ffffff", accent: "#2d0d29", soft: "rgba(255,255,255,0.22)" , onAccent: "#f3f9d4" },
  mauve: { bg: "linear-gradient(135deg, #96507e 0%, #7b4167 100%)", fg: "#ffffff", accent: "#ceed7a", soft: "rgba(255,255,255,0.18)" , onAccent: "#2d0d29" },
  dark: { bg: "linear-gradient(135deg, #2d0d29 0%, #1a0718 100%)", fg: "#f3f9d4", accent: "#ceed7a", soft: "rgba(243,249,212,0.12)" , onAccent: "#2d0d29" },
};

export function ContentArt({ kind, art }: { kind: ArtKind; art: ArtProps }) {
  const t = THEMES[art.theme];
  const base: React.CSSProperties = {
    background: t.bg,
    color: t.fg,
    fontFamily: '"Instrument Sans Variable", system-ui, sans-serif',
  };
  const pad = "6cqi";

  if (kind === "menu") {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ ...base, padding: pad }}>
        <div className="flex items-baseline justify-between" style={{ gap: "3cqi" }}>
          <div style={{ fontSize: "9cqi", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{art.headline}</div>
          {art.sub ? <div style={{ fontSize: "3.4cqi", opacity: 0.8 }}>{art.sub}</div> : null}
        </div>
        <div className="mt-auto grid grid-cols-2" style={{ columnGap: "6cqi", rowGap: "2.2cqi", marginTop: "4cqi" }}>
          {(art.items ?? []).map((it) => (
            <div key={it.label} className="flex items-baseline justify-between" style={{ gap: "2cqi", borderBottom: `1px solid ${t.soft}`, paddingBottom: "1.4cqi" }}>
              <span style={{ fontSize: "3.6cqi", fontWeight: 600 }}>{it.label}</span>
              <span style={{ fontSize: "3.6cqi", fontWeight: 800, color: t.accent }}>{it.value}</span>
            </div>
          ))}
        </div>
        {art.footer ? <div style={{ marginTop: "3.5cqi", fontSize: "2.8cqi", opacity: 0.7 }}>{art.footer}</div> : null}
      </div>
    );
  }

  if (kind === "kpi") {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ ...base, padding: pad }}>
        <div style={{ fontSize: "5cqi", fontWeight: 700, letterSpacing: "-0.01em" }}>{art.headline}</div>
        <div className="mt-auto grid grid-cols-2" style={{ gap: "3cqi", marginTop: "4cqi" }}>
          {(art.items ?? []).map((it, i) => (
            <div key={it.label} style={{ background: t.soft, borderRadius: "2.5cqi", padding: "3cqi 3.5cqi" }}>
              <div style={{ fontSize: "2.8cqi", opacity: 0.75 }}>{it.label}</div>
              <div style={{ fontSize: "8cqi", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginTop: "0.5cqi" }}>{it.value}</div>
              <div className="flex items-end" style={{ gap: "0.8cqi", height: "3.5cqi", marginTop: "1.6cqi" }}>
                {[40, 55, 45, 70, 62, 85, 78, 96].map((h, j) => (
                  <span key={j} style={{ flex: 1, height: `${h}%`, background: t.accent, opacity: j === 7 ? 1 : 0.45 + i * 0.05, borderRadius: "0.6cqi" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {art.footer ? <div style={{ marginTop: "3cqi", fontSize: "2.8cqi", opacity: 0.7 }}>{art.footer}</div> : null}
      </div>
    );
  }

  if (kind === "queue") {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ ...base, padding: pad }}>
        <div style={{ fontSize: "3.6cqi", fontWeight: 700, letterSpacing: "0.18em", opacity: 0.75 }}>NOW SERVING</div>
        <div className="flex items-baseline" style={{ gap: "4cqi", marginTop: "1cqi" }}>
          <div style={{ fontSize: "26cqi", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: t.accent }}>{art.headline}</div>
          {art.sub ? <div style={{ fontSize: "5cqi", fontWeight: 600, opacity: 0.85 }}>{art.sub}</div> : null}
        </div>
        <div className="mt-auto grid grid-cols-3" style={{ gap: "2.5cqi" }}>
          {(art.items ?? []).map((it) => (
            <div key={it.label} style={{ background: t.soft, borderRadius: "2cqi", padding: "2.2cqi 3cqi" }}>
              <div style={{ fontSize: "2.6cqi", opacity: 0.75 }}>{it.label}</div>
              <div style={{ fontSize: "6cqi", fontWeight: 800, letterSpacing: "-0.02em" }}>{it.value}</div>
            </div>
          ))}
        </div>
        {art.footer ? <div style={{ marginTop: "3cqi", fontSize: "2.8cqi", opacity: 0.7 }}>{art.footer}</div> : null}
      </div>
    );
  }

  if (kind === "welcome") {
    return (
      <div className="absolute inset-0 flex flex-col justify-center" style={{ ...base, padding: pad }}>
        <div style={{ width: "10cqi", height: "10cqi", borderRadius: "50%", background: t.accent, opacity: 0.9 }} />
        <div style={{ fontSize: "11cqi", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", marginTop: "5cqi" }}>{art.headline}</div>
        {art.sub ? <div style={{ fontSize: "4.2cqi", opacity: 0.85, marginTop: "3cqi" }}>{art.sub}</div> : null}
        {art.footer ? <div style={{ marginTop: "auto", fontSize: "2.8cqi", opacity: 0.7 }}>{art.footer}</div> : null}
      </div>
    );
  }

  if (kind === "advisory") {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ ...base, padding: pad }}>
        <div className="flex items-center" style={{ gap: "2cqi" }}>
          <span style={{ width: "4cqi", height: "4cqi", borderRadius: "50%", background: t.accent }} />
          <span style={{ fontSize: "3.2cqi", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{art.badge ?? "Advisory"}</span>
        </div>
        <div style={{ fontSize: "9.5cqi", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", marginTop: "4cqi" }}>{art.headline}</div>
        {art.sub ? <div style={{ fontSize: "4cqi", opacity: 0.88, marginTop: "3cqi", maxWidth: "80%" }}>{art.sub}</div> : null}
        {art.footer ? <div style={{ marginTop: "auto", fontSize: "2.8cqi", opacity: 0.7, borderTop: `1px solid ${t.soft}`, paddingTop: "2.4cqi" }}>{art.footer}</div> : null}
      </div>
    );
  }

  if (kind === "announce") {
    return (
      <div className="absolute inset-0 flex flex-col justify-end" style={{ ...base, padding: pad }}>
        <div style={{ position: "absolute", right: "-6cqi", top: "-8cqi", width: "40cqi", height: "40cqi", borderRadius: "50%", background: t.soft }} />
        <div style={{ fontSize: "9cqi", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em", position: "relative" }}>{art.headline}</div>
        {art.sub ? <div style={{ fontSize: "3.8cqi", opacity: 0.85, marginTop: "2.5cqi", maxWidth: "85%", position: "relative" }}>{art.sub}</div> : null}
        {art.footer ? <div style={{ fontSize: "2.8cqi", opacity: 0.7, marginTop: "4cqi", position: "relative" }}>{art.footer}</div> : null}
      </div>
    );
  }

  // promo (default)
  return (
    <div className="absolute inset-0 flex flex-col" style={{ ...base, padding: pad }}>
      <div style={{ position: "absolute", right: "-10cqi", bottom: "-14cqi", width: "52cqi", height: "52cqi", borderRadius: "50%", background: t.soft }} />
      {art.badge ? (
        <span style={{ alignSelf: "flex-start", fontSize: "2.8cqi", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: t.accent, color: t.onAccent, borderRadius: "999px", padding: "1.2cqi 3cqi" }}>
          {art.badge}
        </span>
      ) : null}
      <div style={{ fontSize: "13cqi", fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.04em", marginTop: "auto", position: "relative" }}>{art.headline}</div>
      {art.sub ? <div style={{ fontSize: "4cqi", opacity: 0.85, marginTop: "2.5cqi", position: "relative" }}>{art.sub}</div> : null}
      {art.footer ? <div style={{ fontSize: "2.8cqi", opacity: 0.7, marginTop: "4cqi", position: "relative" }}>{art.footer}</div> : null}
    </div>
  );
}
