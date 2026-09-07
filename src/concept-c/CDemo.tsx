import { cx } from "./cx";
import { ConnectionFlow } from "./demo/ConnectionFlow";
import { DashboardFrame } from "./demo/DashboardFrame";
import { DisplayWall } from "./demo/DisplayWall";
import { SCENARIOS } from "./demo/scenarios";
import type { Demo } from "./demo/useDemo";

/** The centerpiece: command center on the left, the screens it drives on the right. */
export function CDemo({ demo }: { demo: Demo }) {
  const busy = demo.state.publishing || Object.values(demo.state.screens).some((s) => s.status === "syncing");
  const pulseKey = Object.values(demo.state.screens).reduce((n, s) => n + s.version, 0);

  return (
    <section id="demo" className="scroll-mt-20 bg-[#f6f9ee] py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">See Kiwi in action</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-plum-950 sm:text-5xl">From dashboard to display in seconds.</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-plum-950/65">
            This is a live simulation. Pick a scenario, then click content, playlists and schedules on the left and watch the screens on the right follow.
          </p>
        </div>

        {/* Scenario presets */}
        <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Demo scenario" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
          {SCENARIOS.map((s) => {
            const active = s.id === demo.state.scenarioId;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => demo.setScenario(s.id)}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                  active ? "bg-plum-950 text-white shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)]" : "bg-white text-plum-950/75 ring-1 ring-plum-950/10 hover:-translate-y-px hover:text-plum-950 hover:shadow",
                )}
              >
                <span className="c-icon" style={{ fontSize: 17 }} aria-hidden="true">{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Stage */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_96px_minmax(0,1fr)] lg:gap-4" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
              <span className="c-icon" style={{ fontSize: 16 }} aria-hidden="true">dashboard</span>
              Command center · your Kiwi dashboard
            </div>
            <DashboardFrame demo={demo} />
          </div>

          <div className="flex justify-center lg:h-full lg:items-center lg:pt-8">
            <ConnectionFlow busy={busy} pulseKey={pulseKey} />
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
              <span className="c-icon" style={{ fontSize: 16 }} aria-hidden="true">tv</span>
              Your screens · {new Set(demo.scenario.screens.map((s) => s.location)).size} locations
            </div>
            <DisplayWall demo={demo} />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center" data-reveal>
          <p className="text-[18px] font-semibold text-plum-950">You manage content here. Kiwi pushes it there.</p>
          <ul className="flex flex-wrap justify-center gap-2 text-[12.5px] text-plum-950/65">
            {["Click a thumbnail to push it to the selected screen", "Pick a playlist to start a rotation", "Apply a schedule or publish to every screen"].map((t) => (
              <li key={t} className="rounded-full bg-white px-3 py-1.5 ring-1 ring-plum-950/10">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
