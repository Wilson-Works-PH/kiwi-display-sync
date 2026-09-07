import { useState } from "react";
import { cx } from "../cx";
import { ContentArt } from "./ContentArt";
import { StatusChip } from "./StatusChip";
import type { Demo } from "./useDemo";

type Tab = "library" | "playlists" | "schedule";

/**
 * The "command center": a simulated Kiwi dashboard in a browser frame. Left
 * rail lists the scenario's screens (click to select); the main pane has the
 * content library, playlists and schedules; the header publishes to the whole
 * fleet. Every control is wired to the demo reducer — no backend.
 */
export function DashboardFrame({
  demo,
  interactive = true,
}: {
  demo: Demo;
  interactive?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const { scenario, state, selectedScreen } = demo;
  const selectedState = state.screens[selectedScreen.id];
  const online = scenario.screens.length;

  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border border-plum-950/10 bg-white shadow-[0_32px_64px_-32px_rgba(45,13,41,0.4)]",
        !interactive && "pointer-events-none select-none",
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 border-b border-plum-950/10 bg-[#faf9f5] px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#e8a3bd]" />
          <span className="size-2.5 rounded-full bg-[#d8ec95]" />
          <span className="size-2.5 rounded-full bg-[#c1d786]" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-plum-950/55 ring-1 ring-plum-950/10">
          <span className="c-icon" style={{ fontSize: 13 }} aria-hidden="true">
            lock
          </span>
          kiwi.wilsonworksph.com/displays
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[176px_minmax(0,1fr)]">
        {/* Rail */}
        <aside className="flex flex-col border-b border-plum-950/10 bg-[#fbfbf7] p-3 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2 px-1 pb-3">
            <span className="grid size-6 place-items-center rounded-md bg-plum-950 text-[11px] font-black text-lime-400">
              k
            </span>
            <span className="truncate text-[12.5px] font-bold text-plum-950">
              {scenario.workspace}
            </span>
          </div>
          <div className="px-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-plum-950/45">
            Screens
          </div>
          <ul className="c-scroll mt-1.5 flex gap-1 overflow-x-auto sm:flex-col sm:gap-0.5 sm:overflow-visible">
            {scenario.screens.map((s) => {
              const st = state.screens[s.id];
              const selected = s.id === state.selectedScreenId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => demo.selectScreen(s.id)}
                    aria-pressed={selected}
                    className={cx(
                      "flex w-full min-w-[150px] items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors sm:min-w-0",
                      selected
                        ? "bg-lime-400/50 text-plum-950"
                        : "text-plum-950/80 hover:bg-plum-950/[0.04]",
                    )}
                  >
                    <span
                      className={cx(
                        "size-1.5 shrink-0 rounded-full",
                        st.status === "syncing"
                          ? "c-pulse bg-plum-950/50"
                          : "bg-leaf-600",
                      )}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold leading-tight">
                        {s.name}
                      </span>
                      <span className="block truncate text-[10.5px] text-plum-950/50">
                        {s.location}
                      </span>
                    </span>
                    <span
                      className="c-icon shrink-0 text-plum-950/40"
                      style={{ fontSize: 14 }}
                      aria-hidden="true"
                    >
                      {s.orientation === "portrait"
                        ? "stay_current_portrait"
                        : "stay_current_landscape"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto hidden rounded-xl bg-plum-950 p-3 text-cream-100 sm:block">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span
                className="c-pulse size-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_#ceed7a]"
                aria-hidden="true"
              />
              {online} screens online
            </div>
            <div className="mt-0.5 text-[10.5px] text-cream-100/60">
              {new Set(scenario.screens.map((s) => s.location)).size} locations
              · 0 offline
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-plum-950/10 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-bold text-plum-950">
                Displays
              </div>
              <div className="truncate text-[11.5px] text-plum-950/55">
                Selected:{" "}
                <span className="font-semibold text-plum-950/80">
                  {selectedScreen.name}
                </span>{" "}
                · {selectedScreen.location}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusChip status={selectedState.status} />
              <button
                type="button"
                onClick={demo.publishAll}
                disabled={state.publishing}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-3.5 py-2 text-[12px] font-bold text-plum-950 shadow-[0_8px_20px_-10px_rgba(45,13,41,0.6)] transition-all",
                  "hover:-translate-y-px hover:bg-lime-300 hover:shadow-[0_12px_24px_-10px_rgba(45,13,41,0.6)] active:translate-y-0",
                  "disabled:cursor-default disabled:opacity-80 disabled:hover:translate-y-0",
                )}
              >
                {state.publishing ? (
                  <span
                    className="c-spin size-3 rounded-full border-2 border-plum-950/25 border-t-plum-950"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="c-icon is-filled"
                    style={{ fontSize: 15 }}
                    aria-hidden="true"
                  >
                    publish
                  </span>
                )}
                {state.publishing ? (
                  "Publishing…"
                ) : (
                  <>
                    <span className="sm:hidden">Publish all</span>
                    <span className="hidden sm:inline">
                      Publish to all screens
                    </span>
                  </>
                )}
              </button>
            </div>
          </header>

          <nav
            className="c-scroll flex gap-1 overflow-x-auto border-b border-plum-950/10 px-3 pt-2"
            aria-label="Dashboard panels"
          >
            {(
              [
                ["library", "photo_library", "Content library"],
                ["playlists", "playlist_play", "Playlists"],
                ["schedule", "calendar_month", "Schedule"],
              ] as const
            ).map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-selected={tab === id}
                role="tab"
                className={cx(
                  "-mb-px inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-[12px] font-semibold transition-colors",
                  tab === id
                    ? "border-plum-950 text-plum-950"
                    : "border-transparent text-plum-950/55 hover:text-plum-950/85",
                )}
              >
                <span
                  className="c-icon"
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </nav>

          <div className="c-scroll flex-1 overflow-auto p-4 sm:min-h-[296px]">
            {tab === "library" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {scenario.content.map((c) => {
                  const onScreen =
                    selectedState.assignment.type === "content" &&
                    selectedState.assignment.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => demo.assignContent(c.id)}
                      className="group text-left"
                      aria-label={`Push ${c.title} to ${selectedScreen.name}`}
                    >
                      <div
                        className={cx(
                          "relative aspect-video overflow-hidden rounded-lg ring-1 ring-plum-950/10 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_28px_-14px_rgba(45,13,41,0.5)]",
                          onScreen && "ring-2 ring-leaf-600",
                        )}
                        style={{ containerType: "inline-size" }}
                      >
                        <ContentArt kind={c.kind} art={c.art} />
                        {onScreen ? (
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-1.5 py-px text-[9.5px] font-bold text-[#4f6b3a] shadow">
                            On screen
                          </span>
                        ) : (
                          <span className="absolute inset-0 grid place-items-center bg-plum-950/0 opacity-0 transition-all group-hover:bg-plum-950/25 group-hover:opacity-100">
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-plum-950 shadow">
                              Push to screen
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[12px] font-semibold text-plum-950">
                          {c.title}
                        </span>
                        <span className="shrink-0 rounded-full bg-plum-950/[0.05] px-1.5 py-px text-[10px] font-medium text-plum-950/60">
                          {c.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {tab === "playlists" ? (
              <ul className="flex flex-col gap-2">
                {scenario.playlists.map((p) => {
                  const active =
                    selectedState.assignment.type === "playlist" &&
                    selectedState.assignment.id === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => demo.assignPlaylist(p.id)}
                        className={cx(
                          "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(45,13,41,0.5)]",
                          active
                            ? "border-leaf-600 bg-leaf-600/10"
                            : "border-plum-950/10 bg-white",
                        )}
                        aria-label={`Play ${p.name} on ${selectedScreen.name}`}
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-plum-950 text-lime-400">
                          <span
                            className="c-icon is-filled"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          >
                            playlist_play
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-bold text-plum-950">
                            {p.name}
                          </span>
                          <span className="block truncate text-[11px] text-plum-950/55">
                            {p.items
                              .map(
                                (id) =>
                                  scenario.content.find((c) => c.id === id)
                                    ?.title ?? id,
                              )
                              .join(" · ")}
                          </span>
                        </span>
                        <span
                          className={cx(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                            active
                              ? "bg-leaf-600 text-white"
                              : "bg-plum-950/[0.05] text-plum-950/60",
                          )}
                        >
                          {active ? "Rotating" : `${p.items.length} items`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {tab === "schedule" ? (
              <ul className="flex flex-col gap-2">
                {scenario.schedules.map((s) => {
                  const active = state.activeScheduleId === s.id;
                  const target =
                    s.target.type === "content"
                      ? scenario.content.find((c) => c.id === s.target.id)
                          ?.title
                      : scenario.playlists.find((p) => p.id === s.target.id)
                          ?.name;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => demo.applySchedule(s.id)}
                        className={cx(
                          "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(45,13,41,0.5)]",
                          active
                            ? "border-leaf-600 bg-leaf-600/10"
                            : "border-plum-950/10 bg-white",
                        )}
                        aria-label={`Apply ${s.name} schedule to all screens`}
                      >
                        <span className="w-[92px] shrink-0 font-mono text-[11px] font-semibold text-plum-950/70">
                          {s.when}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-bold text-plum-950">
                            {s.name}
                          </span>
                          <span className="block truncate text-[11px] text-plum-950/55">
                            {s.target.type === "playlist"
                              ? "Playlist"
                              : "Content"}{" "}
                            · {target}
                          </span>
                        </span>
                        <span
                          className={cx(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                            active
                              ? "bg-leaf-600 text-white"
                              : "bg-plum-950/[0.05] text-plum-950/60",
                          )}
                        >
                          {active ? "Active" : "Apply to all"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <footer className="flex items-center gap-2 border-t border-plum-950/10 bg-[#fbfbf7] px-4 py-2 text-[11.5px] text-plum-950/65">
            <span
              className="c-pulse size-1.5 shrink-0 rounded-full bg-leaf-600"
              aria-hidden="true"
            />
            <span className="truncate">{state.activity}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
