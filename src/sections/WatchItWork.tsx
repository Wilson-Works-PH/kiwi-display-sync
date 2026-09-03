import { useRef, useState } from "react";
import { Reveal } from "../components/Reveal";
import { useTheme } from "../lib/theme";
import { prefersReducedMotion } from "../lib/motion";

/** Per-theme recordings of the real app. */
const CLIPS = [
  {
    key: "designer",
    dark: { src: "/media/designer-preview.mp4", poster: "/media/designer-preview-poster.jpg" },
    light: { src: "/media/designer-preview-light.mp4", poster: "/media/designer-preview-light-poster.jpg" },
    title: "design, then press play",
    caption:
      "A real layout in the designer, previewed in the browser exactly as the screen will play it — transitions included.",
  },
  {
    key: "tour",
    dark: { src: "/media/product-tour.mp4", poster: "/media/product-tour-poster.jpg" },
    light: { src: "/media/product-tour-light.mp4", poster: "/media/product-tour-light-poster.jpg" },
    title: "one dashboard, whole fleet",
    caption:
      "Dashboard, content library, schedule calendar and live fleet — a full lap around the platform.",
  },
];

function Clip({ src, poster, title }: { src: string; poster: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplay] = useState(() => !prefersReducedMotion());
  const [playing, setPlaying] = useState(autoplay);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="group relative">
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        width={1280}
        height={800}
        autoPlay={autoplay}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full rounded-2xl border border-line shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)]"
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? `Pause "${title}" video` : `Play "${title}" video`}
        className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-plum-900/80 text-lime-400 opacity-0 backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
            <path d="M8 5l11 7-11 7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function WatchItWork() {
  const { theme } = useTheme();

  return (
    <section className="bg-surface-alt py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
            Watch it work
          </p>
        </Reveal>
        <h2
          data-split-reveal className="font-display mt-4 max-w-2xl text-4xl leading-[1.02] font-black lowercase sm:text-6xl">
            no mockups — this is <span className="text-accent-text">the real app</span>
          </h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {CLIPS.map((c, i) => {
            const media = theme === "light" ? c.light : c.dark;
            return (
              <Reveal key={c.key} delay={i * 120}>
                <figure>
                  <Clip src={media.src} poster={media.poster} title={c.title} />
                  <figcaption className="mt-4">
                    <div className="font-display text-xl font-black lowercase">
                      {c.title}
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{c.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
