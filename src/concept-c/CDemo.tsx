import type { CSSProperties } from "react";
import { cx } from "./cx";
import { ConnectionFlow } from "./demo/ConnectionFlow";
import { DashboardFrame } from "./demo/DashboardFrame";
import { DisplayWall } from "./demo/DisplayWall";
import { MobileDemo } from "./demo/MobileDemo";
import { SCENARIOS } from "./demo/scenarios";
import type { Demo } from "./demo/useDemo";
import { useMediaQuery } from "./useMediaQuery";

/**
 * The centerpiece. Phones and tablets get the guided vertical flow (live
 * display pinned on top, controls beneath, one big Publish). Desktop gets the
 * cinematic side-by-side: dashboard → cloud → screens. Only one mounts.
 */
export function CDemo({ demo }: { demo: Demo }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const busy = demo.state.publishing || Object.values(demo.state.screens).some((s) => s.status === "syncing");
  const pulseKey = Object.values(demo.state.screens).reduce((n, s) => n + s.version, 0);

  return (
    <section id="demo" className="scroll-mt-14 bg-[#f6f9ee] py-14 lg:scroll-mt-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl lg:text-center" data-reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">See Kiwi in action</p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-plum-950 sm:text-4xl lg:mt-3 lg:text-5xl">
            <span className="lg:hidden">Tap a campaign. Publish. Watch the screen change.</span>
            <span className="hidden lg:inline">From dashboard to display in seconds.</span>
          </h2>
          <p className="mt-3 hidden text-[17px] leading-relaxed text-plum-950/65 lg:block">
            A live simulation: click content, playlists and schedules on the left and watch the screens on the right follow.
          </p>
        </div>

        {/* Scenario presets — swipeable chips on phones, centred pills on desktop. */}
        <div className="c-scroll -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-10 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0" role="tablist" aria-label="Demo scenario" data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>
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
                  "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-all",
                  active ? "bg-plum-950 text-white shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)]" : "bg-white text-plum-950/75 ring-1 ring-plum-950/10",
                )}
              >
                <span className="c-icon" style={{ fontSize: 17 }} aria-hidden="true">{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {desktop ? (
          <>
            <div className="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(0,1.3fr)_96px_minmax(0,1fr)]" data-reveal style={{ "--reveal-delay": "160ms" } as CSSProperties}>
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
                  <span className="c-icon" style={{ fontSize: 16 }} aria-hidden="true">dashboard</span>
                  Command center · your Kiwi dashboard
                </div>
                <DashboardFrame demo={demo} />
              </div>
              <div className="flex h-full items-center justify-center pt-8">
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
          </>
        ) : (
          <div className="mt-2">
            <MobileDemo key={demo.scenario.id} demo={demo} />
            <p className="mt-8 text-center text-[15px] font-semibold text-plum-950">You manage content here. Kiwi pushes it there.</p>
          </div>
        )}
      </div>
    </section>
  );
}
