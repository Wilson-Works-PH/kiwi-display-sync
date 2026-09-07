import { useEffect, useRef, useState } from "react";
import { cx } from "../cx";
import { useInView } from "../useInView";
import { ContentArt } from "./ContentArt";
import { DEVICES, fitWidth } from "./devices";
import { DisplayFrame } from "./DisplayWall";
import type { ContentItem } from "./scenarios";
import { StatusChip } from "./StatusChip";
import type { Demo, PublishPhase } from "./useDemo";

type Mode = "single" | "multi";

/** Phone header height (sticky) and the compact live preview's footprint. */
const TOP_OFFSET = 56;
const COMPACT_H = 124;

/**
 * The guided, one-thumb demo for phones and tablets.
 *
 *   LIVE DISPLAY  — the real Kiwi unit, large, in normal flow
 *   ↓ scroll      — as it leaves the viewport a COMPACT sticky preview of the
 *                   same screen takes over under the header (zero flow
 *                   footprint, so nothing jumps) and stays until the demo ends
 *   CONTROL       — pick content (marks SELECTED only) → target → PUBLISH
 *
 * Publish runs the four-beat sequence and then the screen changes — in the
 * compact preview the visitor is looking at, and in the large unit above.
 * One screen first; the fleet step is revealed after the first success.
 * Mounted with `key={scenario.id}` so every scenario starts fresh.
 */
export function MobileDemo({ demo }: { demo: Demo }) {
  const { scenario, state } = demo;
  const primary = scenario.screens[0];
  const dev = DEVICES[primary.device];
  const portrait = primary.orientation === "portrait";
  const [draftId, setDraftId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("single");
  const [multi, setMulti] = useState<string[]>(() =>
    scenario.screens.map((s) => s.id),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const largeRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLButtonElement>(null);
  const rootInView = useInView(rootRef, "-25% 0px -25% 0px");
  const largeInView = useInView(
    largeRef,
    `-${TOP_OFFSET + COMPACT_H}px 0px 0px 0px`,
  );
  const inlineVisible = useInView(publishRef, "0px 0px -8px 0px");

  const phase: PublishPhase = state.publishPhase;
  const busy =
    phase === "publishing" || phase === "sending" || phase === "syncing";
  const published = phase === "done";
  const inMulti = mode === "multi";
  const step = inMulti
    ? published
      ? "multiPublished"
      : "multi"
    : published
      ? "published"
      : "pick";
  const targets = inMulti ? multi : [primary.id];
  const draft = draftId
    ? (scenario.content.find((c) => c.id === draftId) ?? null)
    : null;
  const canPublish = !!draft && targets.length > 0 && !busy && !published;
  const updatedAt = state.publishedAt;
  const primaryState = state.screens[primary.id];
  const liveContent = demo.contentFor(primary.id);
  const compact = rootInView && !largeInView;
  const showSticky = canPublish && rootInView && !inlineVisible;

  const { showWelcome } = demo;
  useEffect(() => {
    showWelcome();
  }, [showWelcome]);

  const pick = (id: string) => {
    setDraftId(id);
    if (published) demo.resetPhase();
  };
  const publish = () => {
    if (!draft) return;
    demo.publishSequence(targets, { type: "content", id: draft.id });
  };
  const toggleTarget = (id: string) =>
    setMulti((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  const goMulti = () => {
    setMode("multi");
    demo.resetPhase();
  };
  const tryAnother = () => {
    setDraftId(null);
    demo.resetPhase();
  };

  const targetLabel = inMulti
    ? `${targets.length} screen${targets.length === 1 ? "" : "s"}`
    : primary.name;
  const publishLabel = busy
    ? PHASE_LABEL[phase](primary.name, targets.length)
    : published
      ? "Published ✓"
      : draft
        ? `Publish “${shortName(draft)}” → ${targetLabel}`
        : "Publish to screen";

  const liveStatus = (
    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
      {published && updatedAt ? (
        <span className="c-rise-in text-leaf-600">Updated just now ✓</span>
      ) : busy ? (
        <StatusChip status="syncing" size="xs" />
      ) : (
        <span className="flex items-center gap-1.5 text-plum-950/55">
          <span
            className="c-pulse size-1.5 rounded-full bg-leaf-600"
            aria-hidden="true"
          />
          Online
        </span>
      )}
    </span>
  );

  return (
    <div ref={rootRef} className="relative lg:hidden">
      {/* COMPACT STICKY PREVIEW — the screen the visitor is controlling, kept
          in view under the header once the large unit has scrolled away.
          Negative bottom margin gives it zero footprint in the flow. */}
      <div
        className={cx(
          "sticky z-30 -mx-5 px-5 transition-opacity duration-200 sm:-mx-8 sm:px-8",
          compact ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ top: TOP_OFFSET, height: COMPACT_H, marginBottom: -COMPACT_H }}
        aria-hidden={!compact}
      >
        <div
          className={cx(
            "flex h-[112px] items-center gap-3 rounded-2xl bg-white/95 p-2.5 shadow-[0_14px_32px_-16px_rgba(45,13,41,0.45)] ring-1 ring-plum-950/10 backdrop-blur-md",
            busy && "c-lime-pulse",
          )}
        >
          <div
            className="relative h-full shrink-0 overflow-hidden rounded-[8px] bg-[#1a0718] ring-[3px] ring-plum-950"
            style={{ aspectRatio: "16 / 9", containerType: "inline-size" }}
          >
            {liveContent ? (
              <div
                key={`${liveContent.id}-${primaryState.version}`}
                className="c-fade-in absolute inset-0"
              >
                <ContentArt kind={liveContent.kind} art={liveContent.art} />
              </div>
            ) : null}
            {busy ? (
              <div className="absolute inset-0 grid place-items-center bg-plum-950/45">
                <span
                  className="c-spin size-4 rounded-full border-2 border-white/30 border-t-lime-400"
                  aria-hidden="true"
                />
              </div>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
              <span
                className="c-pulse size-1.5 rounded-full bg-leaf-600"
                aria-hidden="true"
              />
              Live
            </div>
            <div className="truncate text-[14.5px] font-bold text-plum-950">
              {primary.name}
            </div>
            <div className="truncate text-[11px] text-plum-950/55">
              {dev.name}
            </div>
            <div className="mt-1.5">
              {published && updatedAt ? (
                <span className="text-[11px] font-bold text-leaf-600">
                  Updated just now ✓
                </span>
              ) : (
                <StatusChip status={primaryState.status} size="xs" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE DISPLAY — the physical Kiwi unit, large. */}
      <div ref={largeRef} className="pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-plum-950/55">
            Live display
          </span>
          {liveStatus}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[15px] font-bold text-plum-950">
          <span
            className="size-2 rounded-full bg-leaf-600"
            aria-hidden="true"
          />
          {primary.name}
        </div>
        <div className="text-[12px] text-plum-950/55">
          {dev.name} · {primary.location}
        </div>

        {step === "multiPublished" ? (
          <div className="c-snap c-scroll c-rise-in -mx-5 mt-3 flex gap-4 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
            {scenario.screens.map((s) => {
              const d = DEVICES[s.device];
              return (
                <div
                  key={s.id}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="flex h-[240px] w-[min(60vw,260px)] items-end justify-center">
                    <div style={{ width: fitWidth(d, 240) }}>
                      <DisplayFrame
                        screen={s}
                        demo={demo}
                        interactive={false}
                        showLabel={false}
                      />
                    </div>
                  </div>
                  <span className="max-w-[140px] truncate text-[11.5px] font-semibold text-plum-950">
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative mt-3 flex justify-center">
            <div
              className="relative"
              style={
                portrait
                  ? {
                      height: "min(44vh, 400px)",
                      aspectRatio: `${dev.w} / ${dev.h}`,
                    }
                  : { width: "100%", maxWidth: 460 }
              }
            >
              <DisplayFrame
                screen={primary}
                demo={demo}
                interactive={false}
                priority
                showLabel={false}
              />
            </div>
            {busy ? (
              <div className="c-rise-in absolute inset-x-0 bottom-2 flex justify-center">
                <span className="c-lime-pulse flex items-center gap-2 rounded-full bg-plum-950 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-lg">
                  <span
                    className="c-spin size-3 rounded-full border-2 border-white/30 border-t-lime-400"
                    aria-hidden="true"
                  />
                  {PHASE_LABEL[phase](primary.name, targets.length)}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* CONTROL */}
      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-600">
          Control
        </p>
        <h3 className="mt-1 text-[20px] font-bold tracking-tight text-plum-950">
          Choose your content
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {scenario.content.slice(0, 4).map((c) => {
            const selected = draftId === c.id;
            const live = primaryState?.assignment.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c.id)}
                aria-pressed={selected}
                className={cx(
                  "group relative overflow-hidden rounded-2xl bg-white text-left transition-all duration-200 active:scale-[0.99]",
                  selected
                    ? "-translate-y-0.5 ring-[3px] ring-plum-950 shadow-[0_18px_36px_-16px_rgba(45,13,41,0.55)]"
                    : "ring-1 ring-plum-950/10",
                )}
              >
                <div
                  className="relative aspect-[4/3]"
                  style={{ containerType: "inline-size" }}
                >
                  <ContentArt kind={c.kind} art={c.art} />
                  {selected ? (
                    <span className="c-rise-in absolute left-2 top-2 flex items-center gap-1 rounded-full bg-plum-950 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white shadow">
                      <span
                        className="c-icon is-filled"
                        style={{ fontSize: 12 }}
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      Selected
                    </span>
                  ) : live ? (
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-bold text-plum-950/70 shadow">
                      On screen
                    </span>
                  ) : null}
                </div>
                <div
                  className={cx(
                    "px-3 py-2.5",
                    selected && "bg-plum-950 text-white",
                  )}
                >
                  <div className="truncate text-[13.5px] font-bold">
                    {c.title}
                  </div>
                  <div
                    className={cx(
                      "text-[11.5px]",
                      selected ? "text-white/70" : "text-plum-950/55",
                    )}
                  >
                    {c.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-600">
          Target display
        </p>
        {inMulti ? (
          <ul className="mt-2 flex flex-col gap-2">
            {scenario.screens.map((s) => {
              const on = multi.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleTarget(s.id)}
                    aria-pressed={on}
                    className={cx(
                      "flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left transition-colors",
                      on ? "ring-2 ring-plum-950" : "ring-1 ring-plum-950/10",
                    )}
                  >
                    <span
                      className={cx(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[13px] font-black",
                        on
                          ? "bg-plum-950 text-lime-400"
                          : "bg-plum-950/[0.06] text-transparent",
                      )}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold text-plum-950">
                        {s.name}
                      </span>
                      <span className="block truncate text-[12px] text-plum-950/55">
                        {s.location} · {DEVICES[s.device].name}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4f6b3a]">
                      <span
                        className="size-1.5 rounded-full bg-leaf-600"
                        aria-hidden="true"
                      />
                      Online
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-2 flex min-h-[64px] items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-plum-950/10">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-plum-950 text-lime-400">
              <span
                className="c-icon"
                style={{ fontSize: 20 }}
                aria-hidden="true"
              >
                {portrait ? "stay_current_portrait" : "tv"}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-bold text-plum-950">
                {primary.name}
              </span>
              <span className="block truncate text-[12px] text-plum-950/55">
                {dev.name}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4f6b3a]">
              <span
                className="c-pulse size-1.5 rounded-full bg-leaf-600"
                aria-hidden="true"
              />
              Online
            </span>
          </div>
        )}

        <button
          ref={publishRef}
          type="button"
          onClick={publish}
          disabled={!canPublish}
          className={cx(
            "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full px-5 text-[16px] font-bold transition-all",
            canPublish
              ? "bg-lime-400 text-plum-950 shadow-[0_14px_28px_-12px_rgba(45,13,41,0.5)] active:scale-[0.99]"
              : "bg-plum-950/[0.06] text-plum-950/40",
            busy && "c-lime-pulse !bg-plum-950 !text-white",
            published && "!bg-leaf-600 !text-white",
          )}
        >
          {busy ? (
            <span
              className="c-spin size-4 shrink-0 rounded-full border-2 border-white/30 border-t-lime-400"
              aria-hidden="true"
            />
          ) : (
            <span
              className="c-icon is-filled shrink-0"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              {published ? "check_circle" : "publish"}
            </span>
          )}
          <span className="truncate">{publishLabel}</span>
        </button>
        {!draft && step === "pick" ? (
          <p className="mt-2 text-center text-[12.5px] text-plum-950/55">
            Pick a campaign above, then publish.
          </p>
        ) : null}

        {published ? (
          <div className="c-rise-in mt-5 rounded-2xl bg-white p-4 ring-1 ring-plum-950/10">
            <div className="flex items-center gap-2 text-[15px] font-bold text-plum-950">
              <span className="grid size-6 place-items-center rounded-full bg-leaf-600 text-white">
                <span
                  className="c-icon is-filled"
                  style={{ fontSize: 15 }}
                  aria-hidden="true"
                >
                  check
                </span>
              </span>
              Published to{" "}
              {step === "multiPublished"
                ? `${targets.length} screens`
                : primary.name}{" "}
              ✓
            </div>
            <p className="mt-1 text-[13px] text-plum-950/60">
              {step === "multiPublished"
                ? "Every screen updated in about two seconds."
                : `${primary.name} is now showing “${draft?.title ?? "your campaign"}”.`}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={tryAnother}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-4 text-[14px] font-bold text-plum-950 ring-1 ring-plum-950/15"
              >
                Try another campaign
              </button>
              {step === "published" ? (
                <button
                  type="button"
                  onClick={goMulti}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-full bg-plum-950 px-4 text-[14px] font-bold text-white"
                >
                  Publish to multiple screens
                  <span
                    className="c-icon"
                    style={{ fontSize: 16 }}
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === "published" ? (
          <div className="c-rise-in mt-4 rounded-2xl bg-plum-950 p-4 text-cream-100">
            <div className="text-[15px] font-bold text-white">
              Now update every screen.
            </div>
            <p className="mt-1 text-[13px] text-cream-100/70">
              One publish can reach every screen in every location.
            </p>
            <button
              type="button"
              onClick={goMulti}
              className="mt-3 inline-flex min-h-[44px] items-center gap-1 rounded-full bg-lime-400 px-4 text-[14px] font-bold text-plum-950"
            >
              Show me
              <span
                className="c-icon"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Sticky publish — only while the inline button is off-screen and there's something to publish. */}
      <div
        className={cx(
          "c-safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pt-3 transition-all duration-300",
          showSticky
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        aria-hidden={!showSticky}
      >
        <div className="mx-auto max-w-[520px] rounded-full bg-white/95 p-1.5 shadow-[0_18px_40px_-16px_rgba(45,13,41,0.5)] ring-1 ring-plum-950/10 backdrop-blur">
          <button
            type="button"
            onClick={publish}
            disabled={!canPublish}
            tabIndex={showSticky ? 0 : -1}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-4 text-[15px] font-bold text-plum-950 active:scale-[0.99]"
          >
            <span
              className="c-icon is-filled shrink-0"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              publish
            </span>
            <span className="truncate">
              {draft
                ? `Publish “${shortName(draft)}” → ${targetLabel}`
                : "Publish"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** The big words on the campaign when they're short ("50% off"), else its title. */
function shortName(c: ContentItem): string {
  return c.art.headline.length <= 16 ? c.art.headline : c.title;
}

const PHASE_LABEL: Record<PublishPhase, (screen: string, n: number) => string> =
  {
    idle: () => "",
    publishing: () => "Publishing…",
    sending: (screen, n) =>
      n > 1 ? `Sending to ${n} screens…` : `Sending to ${screen}…`,
    syncing: (_s, n) => (n > 1 ? "Screens syncing…" : "Screen syncing…"),
    done: () => "Published ✓",
  };
