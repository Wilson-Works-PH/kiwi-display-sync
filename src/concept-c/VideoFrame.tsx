import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "./cx";

/**
 * A recording of the real Kiwi CMS in a browser frame. Muted, looping, no
 * controls — it plays while on screen and pauses when scrolled away, and under
 * `prefers-reduced-motion` it never starts (the poster stands in). Without a
 * `src` it is just the poster in the frame — used while a clip is still to be
 * recorded, so the page always shows the real product, never a mockup.
 */
export function VideoFrame({
  src,
  poster,
  url = "kiwi.wilsonworksph.com",
  label,
  aspect = "1280 / 800",
  className,
}: {
  src?: string;
  poster: string;
  url?: string;
  label: string;
  aspect?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <BrowserFrame url={url} className={className}>
      <div className="relative bg-[#f6f9ee]" style={{ aspectRatio: aspect }}>
        {src ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
          />
        ) : (
          <img
            src={poster}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </BrowserFrame>
  );
}

/** The browser chrome the recordings sit in: three dots, a URL pill, then whatever you put inside. */
export function BrowserFrame({
  url = "kiwi.wilsonworksph.com",
  className,
  children,
}: {
  url?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cx(
        "overflow-hidden rounded-2xl bg-white shadow-[0_32px_64px_-32px_rgba(45,13,41,0.5)] ring-1 ring-plum-950/10",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-2 border-b border-plum-950/[0.06] bg-[#f6f9ee] px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          {["#e88b8b", "#e6c46a", "#8fcf8f"].map((c) => (
            <span
              key={c}
              className="size-2.5 rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto flex min-w-0 max-w-[60%] items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-plum-950/55 ring-1 ring-plum-950/[0.08]">
          <span className="c-icon" style={{ fontSize: 12 }} aria-hidden="true">
            lock
          </span>
          <span className="truncate">{url}</span>
        </span>
        <span className="w-[42px]" aria-hidden="true" />
      </div>
      {children}
    </figure>
  );
}
