import type { CSSProperties } from "react";
import { cx } from "../cx";
import { ContentArt } from "./ContentArt";
import { DEVICES, SCREEN_BLEED_PCT } from "./devices";
import { ROTATION_MS, type Screen } from "./scenarios";
import { StatusChip } from "./StatusChip";
import type { Demo } from "./useDemo";

/**
 * The "output" side: every screen in the scenario as the real Kiwi device it
 * runs on (product renders from kiwi.com.ph, see devices.ts), playing whatever
 * the dashboard last pushed to it. Landscape screens stack in the wide column;
 * the scenario's portrait device stands beside them. Clicking a display
 * selects it in the dashboard.
 */
export function DisplayWall({ demo }: { demo: Demo }) {
  const landscape = demo.scenario.screens.filter(
    (s) => s.orientation === "landscape",
  );
  const portrait = demo.scenario.screens.filter(
    (s) => s.orientation === "portrait",
  );
  return (
    <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)] items-start gap-6">
      <div className="flex flex-col gap-5">
        {landscape.map((s) => (
          <DisplayFrame key={s.id} screen={s} demo={demo} />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {portrait.map((s) => (
          <DisplayFrame key={s.id} screen={s} demo={demo} />
        ))}
      </div>
    </div>
  );
}

export function DisplayFrame({
  screen,
  demo,
  interactive = true,
  priority = false,
  showLabel = true,
}: {
  screen: Screen;
  demo: Demo;
  interactive?: boolean;
  priority?: boolean;
  showLabel?: boolean;
}) {
  const st = demo.state.screens[screen.id];
  const content = demo.contentFor(screen.id);
  const playlist = demo.playlistFor(screen.id);
  const selected = demo.state.selectedScreenId === screen.id;
  const dev = DEVICES[screen.device];
  const b = SCREEN_BLEED_PCT;
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? () => demo.selectScreen(screen.id) : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-label={interactive ? `Select ${screen.name}` : undefined}
      className="group block w-full text-left"
    >
      {/* The real device: Kiwi's own product render, with the live content
          composited into its measured screen rectangle. */}
      <div
        className={cx(
          "relative transition-transform duration-300",
          interactive && "group-hover:-translate-y-0.5",
        )}
        style={{ aspectRatio: `${dev.w} / ${dev.h}` }}
      >
        <img
          src={dev.src}
          alt=""
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full select-none"
          style={{ filter: "drop-shadow(0 22px 28px rgba(45,13,41,0.22))" }}
        />
        <div
          className="absolute overflow-hidden bg-[#1a0718]"
          style={{
            left: `${dev.screen.left - b}%`,
            top: `${dev.screen.top - b}%`,
            width: `${dev.screen.width + 2 * b}%`,
            height: `${dev.screen.height + 2 * b}%`,
            containerType: "inline-size",
          }}
        >
          {content ? (
            <div
              key={`${content.id}-${st.version}`}
              className="c-fade-in absolute inset-0"
            >
              <ContentArt kind={content.kind} art={content.art} />
            </div>
          ) : null}

          {st.status === "syncing" ? (
            <div className="absolute inset-0 grid place-items-center bg-plum-950/50 backdrop-blur-[2px]">
              <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-plum-950 shadow-lg">
                <span
                  className="c-spin size-2.5 rounded-full border-2 border-plum-950/20 border-t-plum-950"
                  aria-hidden="true"
                />
                Syncing…
              </div>
            </div>
          ) : null}

          {st.status === "published" ? (
            <div className="c-fade-in absolute right-[3%] top-[3%] flex items-center gap-1 rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-plum-950 shadow">
              <span
                className="c-icon is-filled"
                style={{ fontSize: 12 }}
                aria-hidden="true"
              >
                check_circle
              </span>
              Published
            </div>
          ) : null}

          {playlist && st.status !== "syncing" ? (
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
              <div
                key={`${st.version}-${st.playIndex}`}
                className="c-progress h-full bg-lime-400"
                style={{ "--c-duration": `${ROTATION_MS}ms` } as CSSProperties}
              />
            </div>
          ) : null}
        </div>
        {interactive && selected ? (
          <div
            className="pointer-events-none absolute -inset-2 rounded-2xl ring-2 ring-leaf-600"
            aria-hidden="true"
          />
        ) : null}
      </div>

      {showLabel ? (
        <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-plum-950">
              {screen.name}
            </div>
            <div className="truncate text-[11.5px] text-plum-950/55">
              {screen.location} · {dev.name}
              {playlist ? ` · ${playlist.name}` : ""}
            </div>
          </div>
          <StatusChip status={st.status} />
        </div>
      ) : null}
    </Tag>
  );
}
