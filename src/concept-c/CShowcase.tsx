import type { CSSProperties } from "react";
import { cx } from "./cx";
import { VideoFrame } from "./VideoFrame";

const delay = (ms: number) =>
  ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * "See Kiwi in action" — recordings of the real CMS, one per job, alternating
 * text and frame. Roommaster-style: the product is SHOWN, never operated.
 *
 * All four clips are real recordings of the CMS on the local stack
 * (scripts/record-cms.mjs → scripts/encode-clip.sh), 1440×900 → 1280 wide,
 * H.264, with a warm-up pass trimmed off so nothing loads on camera.
 */
const ROWS = [
  {
    id: "displays",
    eyebrow: "Displays",
    title: "Every screen at a glance.",
    body: "Online or offline, storage, last check-in — every unit in every branch on one list, grouped the way your business is.",
    points: [
      "Live online / offline status",
      "Groups by branch, floor or zone",
      "Storage and player version per unit",
    ],
    poster: "/media/displays-light-poster.jpg",
    src: "/media/displays-light.mp4" as string | undefined,
    url: "cms.kiwi.com.ph/displays",
  },
  {
    id: "schedule",
    eyebrow: "Schedule & dayparts",
    title: "Schedule once. It runs itself.",
    body: "Put campaigns on the week, define your mornings, lunches and evenings, and the screens switch on their own.",
    points: [
      "Weekly schedule per screen or group",
      "Dayparts you define once",
      "Repeats and exceptions",
    ],
    poster: "/media/schedule-light-poster.jpg",
    src: "/media/schedule-light.mp4" as string | undefined,
    url: "cms.kiwi.com.ph/schedule",
  },
  {
    id: "designer",
    eyebrow: "Media & layouts",
    title: "From upload to layout in minutes.",
    body: "Pick a template, drop in media from your library, and preview it exactly as the screen will play it.",
    points: [
      "Ready-made templates",
      "Undo, redo and auto-save",
      "Preview at the screen's real size",
    ],
    poster: "/media/designer-light-poster.jpg",
    src: "/media/designer-light.mp4" as string | undefined,
    url: "cms.kiwi.com.ph/layouts",
  },
];

export function CShowcase() {
  return (
    <section
      id="demo"
      className="scroll-mt-14 bg-[#f6f9ee] py-14 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl lg:text-center" data-reveal>
          <p className="font-header text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">
            See Kiwi in action
          </p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-plum-950 sm:text-4xl lg:mt-3 lg:text-5xl">
            From dashboard to display in seconds.
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-plum-950/65 lg:text-[17px]">
            Recordings of the real Kiwi CMS — no mockups.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-12 lg:mt-20 lg:gap-24">
          {ROWS.map((row, i) => (
            <div
              key={row.id}
              data-reveal
              style={delay(80)}
              className={cx(
                "grid items-center gap-6 lg:gap-14",
                // The frame always takes the wide column: swap the template
                // together with the order, not just the order.
                i % 2 === 1
                  ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:[&>*:first-child]:order-2"
                  : "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
              )}
            >
              <div className="min-w-0">
                <p className="font-header text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">
                  {row.eyebrow}
                </p>
                <h3 className="mt-2 text-[26px] font-bold leading-[1.08] tracking-[-0.02em] text-plum-950 lg:text-[34px]">
                  {row.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-plum-950/65 lg:text-[17px]">
                  {row.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {row.points.map((p) => (
                    <li
                      key={p}
                      className="font-header inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-plum-950/75 ring-1 ring-plum-950/10"
                    >
                      <span
                        className="c-icon is-filled text-leaf-600"
                        style={{ fontSize: 14 }}
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <VideoFrame
                src={row.src}
                poster={row.poster}
                url={row.url}
                label={row.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
