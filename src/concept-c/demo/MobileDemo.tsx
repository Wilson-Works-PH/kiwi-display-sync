import { useEffect, useRef, useState } from "react";
import { cx } from "../cx";
import { useInView } from "../useInView";
import { ContentArt } from "./ContentArt";
import { DEVICES } from "./devices";
import { DisplayFrame } from "./DisplayWall";
import type { Demo, PublishPhase } from "./useDemo";

type Mode = "single" | "multi";

/**
 * The guided, one-thumb demo for phones and tablets: LIVE DISPLAY (sticky,
 * a real Kiwi unit) → CONTROL (pick content, see the target, publish). Picking
 * content only marks it SELECTED; nothing reaches the screen until PUBLISH,
 * which runs the four-beat sequence and then flips the display. One screen
 * first; publishing to several is revealed only after the first success.
 */
export function MobileDemo({ demo }: { demo: Demo }) {
  const { scenario, state } = demo;
  const primary =
    scenario.screens.find((s) => s.orientation === "landscape") ??
    scenario.screens[0];
  const [draftId, setDraftId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("single");
  const [multi, setMulti] = useState<string[]>(() =>
    scenario.screens.map((s) => s.id),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLButtonElement>(null);
  const rootInView = useInView(rootRef, "-30% 0px -10% 0px");
  const inlineVisible = useInView(publishRef, "0px 0px -8px 0px");

  const phase: PublishPhase = state.publishPhase;
  const busy =
    phase === "publishing" || phase === "sending" || phase === "syncing";
  const published = phase === "done";
  const inMulti = mode === "multi";
  // Derived steps — no effects needed. (Component is keyed by scenario, so it starts fresh per preset.)
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

  // Every scenario starts on the welcome default.
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

  const publishLabel = busy
    ? PHASE_LABEL[phase](primary.name, targets.length)
    : published
      ? "Published ✓"
      : inMulti
        ? `Publish to ${targets.length} screen${targets.length === 1 ? "" : "s"}`
        : "Publish to screen";

  const showSticky = canPublish && rootInView && !inlineVisible;

  return (
    <div ref={rootRef} className="lg:hidden">
      {/* LIVE DISPLAY — stays pinned under the header while the controls scroll. */}
      <div className="sticky top-14 z-20 -mx-5 bg-[#f6f9ee]/95 px-5 pb-4 pt-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-plum-950/55">
          <span>Live display</span>
          {published && updatedAt ? (
            <span className="c-rise-in text-leaf-600">Updated just now ✓</span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span
                className="c-pulse size-1.5 rounded-full bg-leaf-600"
                aria-hidden="true"
              />
              Online
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[15px] font-bold text-plum-950">
          <span
            className="size-2 rounded-full bg-leaf-600"
            aria-hidden="true"
          />
          {primary.name}
        </div>
        {step === "multiPublished" ? (
          /* After a fleet publish the whole fleet takes the stage: every device, swipeable, all showing the new content. */
          <div className="c-snap c-scroll c-rise-in -mx-5 mt-3 flex gap-4 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
            {scenario.screens.map((s) => {
              const dev = DEVICES[s.device];
              return (
                <div
                  key={s.id}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  {/* Sized by HEIGHT so a tall totem and a wide wall unit share one row. */}
                  <div
                    style={{
                      height: "min(24vh, 190px)",
                      aspectRatio: `${dev.w} / ${dev.h}`,
                    }}
                  >
                    <DisplayFrame
                      screen={s}
                      demo={demo}
                      interactive={false}
                      showLabel={false}
                    />
                  </div>
                  <span className="max-w-[140px] truncate text-[11.5px] font-semibold text-plum-950">
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative mx-auto mt-3 max-w-[460px]">
            <DisplayFrame
              screen={primary}
              demo={demo}
              interactive={false}
              priority
              showLabel={false}
            />
            {busy ? (
              <div className="c-rise-in absolute inset-x-0 -bottom-1 flex justify-center">
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
            const live = state.screens[primary.id]?.assignment.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c.id)}
                aria-pressed={selected}
                className={cx(
                  "group relative overflow-hidden rounded-2xl bg-white text-left ring-1 transition-all active:scale-[0.99]",
                  selected
                    ? "ring-2 ring-leaf-600 shadow-[0_14px_28px_-16px_rgba(45,13,41,0.45)]"
                    : "ring-plum-950/10",
                )}
              >
                <div
                  className="relative aspect-[4/3]"
                  style={{ containerType: "inline-size" }}
                >
                  <ContentArt kind={c.kind} art={c.art} />
                  {selected ? (
                    <span className="c-rise-in absolute left-2 top-2 rounded-full bg-leaf-600 px-2 py-0.5 text-[10.5px] font-bold text-white shadow">
                      Selected ✓
                    </span>
                  ) : live ? (
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-bold text-plum-950/70 shadow">
                      On screen
                    </span>
                  ) : null}
                </div>
                <div className="px-3 py-2.5">
                  <div className="truncate text-[13.5px] font-bold text-plum-950">
                    {c.title}
                  </div>
                  <div className="text-[11.5px] text-plum-950/55">{c.tag}</div>
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
                      "flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 transition-colors",
                      on ? "ring-leaf-600" : "ring-plum-950/10",
                    )}
                  >
                    <span
                      className={cx(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[13px] font-black",
                        on
                          ? "bg-leaf-600 text-white"
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
                tv
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-bold text-plum-950">
                {primary.name}
              </span>
              <span className="block truncate text-[12px] text-plum-950/55">
                {DEVICES[primary.device].name}
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
            "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full text-[16px] font-bold transition-all",
            canPublish
              ? "bg-lime-400 text-plum-950 shadow-[0_14px_28px_-12px_rgba(45,13,41,0.5)] active:scale-[0.99]"
              : "bg-plum-950/[0.06] text-plum-950/40",
            busy && "c-lime-pulse !bg-plum-950 !text-white",
            published && "!bg-leaf-600 !text-white",
          )}
        >
          {busy ? (
            <span
              className="c-spin size-4 rounded-full border-2 border-white/30 border-t-lime-400"
              aria-hidden="true"
            />
          ) : (
            <span
              className="c-icon is-filled"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              {published ? "check_circle" : "publish"}
            </span>
          )}
          {publishLabel}
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
              Published successfully
            </div>
            <p className="mt-1 text-[13px] text-plum-950/60">
              {step === "multiPublished"
                ? `${targets.length} screens updated in about two seconds.`
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
              Manage more than one screen?
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-400 text-[15px] font-bold text-plum-950 active:scale-[0.99]"
          >
            <span
              className="c-icon is-filled"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              publish
            </span>
            {inMulti
              ? `Publish to ${targets.length} screens`
              : `Publish “${draft?.title ?? ""}” to ${primary.name}`}
          </button>
        </div>
      </div>
    </div>
  );
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
