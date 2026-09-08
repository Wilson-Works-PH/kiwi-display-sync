import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";

/**
 * One explanatory caption over a recording: shown from `at` seconds (of the
 * encoded clip) until the next caption takes over, or until the loop restarts.
 * An empty `text` is a deliberate gap.
 */
export interface VideoCaption {
  at: number;
  text: string;
}

/** One encode of a recording: the file, its poster and the frame's aspect ratio. */
export interface VideoSource {
  src: string;
  poster: string;
  /** CSS aspect-ratio of the frame, e.g. "1600 / 1000". */
  aspect: string;
}

const DESKTOP = "(min-width: 1024px)";

function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

/**
 * A recording of the real Kiwi CMS in a browser frame. Muted, looping, no
 * scrubber — it plays while on screen and pauses when scrolled away, and under
 * `prefers-reduced-motion` it never starts (the poster stands in). Without a
 * `src` it is just the poster in the frame — used while a clip is still to be
 * recorded, so the page always shows the real product, never a mockup.
 *
 * Phones (≈80 % of visitors) get their own edit when `mobile` is given: a
 * tighter crop of the same take, so the action reads at 390 px without
 * shrinking the whole desktop page into the frame. The browser chrome shrinks
 * to a slim bar below `sm` for the same reason.
 *
 * `captions` are drawn in the DOM (not burned into the video): they use the
 * site's own type, scale with the frame, and can be retimed without
 * re-encoding. They only appear while the clip plays, so the poster stays clean.
 *
 * Controls: one small pause / resume button and, while paused, a replay — the
 * clip is a passive showcase, not an interactive CMS, so nothing else.
 */
export function VideoFrame({
  src,
  poster,
  url = "cms.kiwi.com.ph",
  label,
  aspect = "1280 / 800",
  mobile,
  captions,
  captionPosition = "bottom",
  className,
}: {
  src?: string;
  poster: string;
  url?: string;
  label: string;
  aspect?: string;
  /** Phone edit (below `lg`); desktop uses `src`/`poster`/`aspect`. */
  mobile?: VideoSource;
  captions?: VideoCaption[];
  /**
   * Where the in-frame caption pill sits from `sm` up (bottom-left by default). Below `sm` the caption
   * moves into the slim browser bar instead, so on phones it never covers the recording.
   */
  captionPosition?: "top" | "top-right" | "bottom" | "bottom-right";
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cue, setCue] = useState(-1);
  const [paused, setPaused] = useState(false);
  const isDesktop = useIsDesktop();
  const source: VideoSource =
    !isDesktop && mobile ? mobile : { src: src ?? "", poster, aspect };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!paused) void video.play().catch(() => undefined);
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [source.src, paused]);

  // Which caption is current: the last one whose `at` has passed. `timeupdate`
  // ticks about four times a second, close enough for sentence-length cues; the
  // loop restart drops currentTime below the first cue and clears the pill.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !captions?.length) return;
    const sync = () => {
      const t = video.currentTime;
      let i = -1;
      for (let k = 0; k < captions.length; k++) if (captions[k].at <= t) i = k;
      setCue(i);
    };
    video.addEventListener("timeupdate", sync);
    video.addEventListener("seeked", sync);
    return () => {
      video.removeEventListener("timeupdate", sync);
      video.removeEventListener("seeked", sync);
    };
  }, [captions, source.src]);

  const caption =
    captions && cue >= 0 && captions[cue].text ? captions[cue] : null;

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setPaused(false);
      void video.play().catch(() => undefined);
    } else {
      setPaused(true);
      video.pause();
    }
  };
  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setPaused(false);
    void video.play().catch(() => undefined);
  };

  return (
    <BrowserFrame url={url} className={className} caption={caption?.text}>
      <div
        className="relative bg-[#f6f9ee]"
        style={{ aspectRatio: source.aspect }}
      >
        {source.src ? (
          <video
            key={source.src}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={source.src}
            poster={source.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
          />
        ) : (
          <img
            src={source.poster}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        {caption ? (
          <div
            className={cx(
              "pointer-events-none absolute inset-x-0 hidden p-[3%] sm:flex sm:p-[3.5%]",
              captionPosition === "top"
                ? "top-0 justify-start"
                : captionPosition === "top-right"
                  ? "top-0 justify-end"
                  : captionPosition === "bottom-right"
                    ? "bottom-0 justify-end pr-[16%] sm:pr-[14%]"
                    : "bottom-0 justify-start pr-[16%] sm:pr-[14%]",
            )}
            aria-hidden="true"
          >
            <p
              key={cue}
              className="c-caption font-header inline-flex max-w-full items-center gap-2 rounded-full bg-plum-950/[0.92] px-3 py-1.5 text-[12px] font-semibold leading-tight text-white shadow-[0_10px_24px_-12px_rgba(45,13,41,0.7)] ring-1 ring-white/10 sm:px-3.5 sm:py-2 sm:text-[13px] lg:text-[14px]"
            >
              <span
                className="size-1.5 flex-none rounded-full bg-lime-400"
                aria-hidden="true"
              />
              {caption.text}
            </p>
          </div>
        ) : null}
        {source.src ? (
          <div className="absolute bottom-[3%] right-[3%] flex items-center gap-1.5">
            {paused ? (
              <FrameButton label="Replay" icon="replay" onClick={replay} />
            ) : null}
            <FrameButton
              label={paused ? "Play" : "Pause"}
              icon={paused ? "play_arrow" : "pause"}
              onClick={togglePause}
            />
          </div>
        ) : null}
      </div>
    </BrowserFrame>
  );
}

/** Tiny round control on the recording: 44 px tap target around a 28 px glyph disc. */
function FrameButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-full text-white/90 transition-opacity hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
    >
      <span className="grid size-7 place-items-center rounded-full bg-plum-950/70 ring-1 ring-white/15 backdrop-blur-[2px]">
        <span className="c-icon is-filled" style={{ fontSize: 16 }} aria-hidden="true">
          {icon}
        </span>
      </span>
    </button>
  );
}

/**
 * The browser chrome the recordings sit in: three dots, a URL pill, then
 * whatever you put inside. Slim on phones — the chrome is decoration and the
 * screen space is the recording's.
 */
export function BrowserFrame({
  url = "cms.kiwi.com.ph",
  className,
  caption,
  children,
}: {
  url?: string;
  className?: string;
  /** Phones only: the active caption, shown in the bar where the URL pill would be. */
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cx(
        "overflow-hidden rounded-xl bg-white shadow-[0_32px_64px_-32px_rgba(45,13,41,0.5)] ring-1 ring-plum-950/10 sm:rounded-2xl",
        className,
      )}
    >
      <div className="flex h-6 items-center gap-2 border-b border-plum-950/[0.06] bg-[#f6f9ee] px-2.5 sm:h-9 sm:px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          {["#e88b8b", "#e6c46a", "#8fcf8f"].map((c) => (
            <span
              key={c}
              className="size-2 rounded-full sm:size-2.5"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto hidden min-w-0 max-w-[60%] items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-plum-950/55 ring-1 ring-plum-950/[0.08] sm:flex">
          <span className="c-icon" style={{ fontSize: 12 }} aria-hidden="true">
            lock
          </span>
          <span className="truncate">{url}</span>
        </span>
        {caption ? (
          <span
            key={caption}
            className="c-caption font-header ml-1 flex min-w-0 flex-1 items-center gap-1.5 text-[11.5px] font-semibold text-plum-950 sm:hidden"
            aria-hidden="true"
          >
            <span className="size-1.5 flex-none rounded-full bg-lime-400" />
            <span className="truncate">{caption}</span>
          </span>
        ) : null}
        <span className="hidden w-[42px] sm:block" aria-hidden="true" />
      </div>
      {children}
    </figure>
  );
}
