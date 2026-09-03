import { Reveal } from "../components/Reveal";

const FEATURES = [
  {
    title: "layout designer",
    body: "Drag widgets onto a pixel-perfect canvas: text, image, video, website, clock, QR code and PDF. Snapping guides, undo/redo, and six starter templates from menu boards to lobby welcomes.",
  },
  {
    title: "campaigns & playlists",
    body: "Rotate layouts with per-item durations, weights and transitions — fades, slides, zooms and spins. Preview the whole rotation in the browser before a single screen sees it.",
  },
  {
    title: "media library",
    body: "Folders with cascading permissions, storage meters, and uploads that go straight to storage. Images, video, PDFs — plus your own brand fonts, rendered exactly as the player will.",
  },
  {
    title: "live fleet status",
    body: "Screens report in the moment they connect or drop. Telemetry, screenshots, storage, faults and crash reports — your displays page is a control room, not a spreadsheet.",
  },
  {
    title: "teams & roles",
    body: "Workspaces with tenant admins, group admins and members. Grant view, edit or delete per user group on folders, displays, layouts, media and more — access cascades down folders.",
  },
  {
    title: "security & audit",
    body: "Two-factor authentication with backup codes, active session management, and an audit log that records who changed what — from layouts to permissions.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-surface-alt py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
            Features
          </p>
        </Reveal>
        <h2
          data-split-reveal className="font-display mt-4 max-w-2xl text-4xl leading-[1.02] font-black lowercase sm:text-6xl">
            everything your screens need. nothing they don't.
          </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <article className="group h-full rounded-2xl border border-line bg-surface-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-text/60">
                <div className="font-display text-5xl font-black text-ink-faint transition-colors group-hover:text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display mt-4 text-2xl font-black lowercase">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {f.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
