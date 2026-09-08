import type { CSSProperties } from "react";
import { cx } from "./cx";
import { VideoFrame, type VideoCaption, type VideoSource } from "./VideoFrame";

const delay = (ms: number) =>
  ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * "See Kiwi in action" — recordings of the real CMS, one per job, alternating
 * text and frame. Roommaster-style: the product is SHOWN, never operated.
 *
 * Each clip is one capability, one action, one result (brief, 2026-09-08):
 * recorded on the local stack (scripts/record-cms.mjs, 1280×800 CSS px at 2×),
 * then cut with scripts/cut-clip.py into a desktop edit and a tighter PHONE
 * edit of the same take — crops in CSS px of the capture, starting on the
 * feature's own page, sidebar and page header out of frame, ending on the
 * result. One benefit caption per clip (not instructions). Caption times are
 * seconds of the encoded clip.
 */
type Row = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  url: string;
  desktop: VideoSource;
  mobile?: VideoSource;
  captions?: VideoCaption[];
  captionPosition?: "top" | "top-right" | "bottom" | "bottom-right";
};

const ROWS: Row[] = [
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
    url: "cms.kiwi.com.ph/displays",
    // Take: the Displays list → location selector → "Makati" → only that location's screens remain.
    // Cut (user, 2026-09-08: "show the whole page first then zoom in" — a clip that opens already
    // cropped reads as a broken page inside the browser frame): whole page ≈1.4 s → push in on the
    // fleet cards + selector as the menu opens, and stays there through the filter (no second zoom —
    // user, 2026-09-08). Same composition for phones, served as a lighter 800-wide encode.
    desktop: {
      src: "/media/displays-light.mp4?v=20260908e",
      poster: "/media/displays-light-poster.jpg?v=20260908e",
      aspect: "1600 / 1000",
    },
    mobile: {
      src: "/media/displays-light-m.mp4?v=20260908e",
      poster: "/media/displays-light-m-poster.jpg?v=20260908e",
      aspect: "1600 / 1000",
    },
    // Top-left: the result (two cards) fills the lower frame; the filter chips up there are not the action.
    captionPosition: "top",
    captions: [{ at: 0.6, text: "See screens across your locations." }],
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
    url: "cms.kiwi.com.ph/schedule",
    // Take: the week scoped to the "Makati storefront" screens (breakfast / lunch / afternoon blocks on
    // Mon–Wed) → arm "Kiwi Food" → drag a window on Thursday → the naming step is cut → the new block
    // sits on the week. Cut: whole page ≈1.4 s → one push-in to the library + week grid (drawer region
    // out; the time labels and every existing block stay whole). No physical-screen transition is
    // implied — the clip shows the schedule being configured.
    desktop: {
      src: "/media/schedule-light.mp4?v=20260908b",
      poster: "/media/schedule-light-poster.jpg?v=20260908b",
      aspect: "1600 / 1000",
    },
    mobile: {
      src: "/media/schedule-light-m.mp4?v=20260908b",
      poster: "/media/schedule-light-m-poster.jpg?v=20260908b",
      aspect: "1600 / 1000",
    },
    // Bottom-right (tablet up): the empty Fri column and the space under Thursday's block; on phones the
    // caption lives in the frame's bar. Bottom-left sat on the Mon/Tue afternoon blocks, top-right on
    // the day headers.
    captionPosition: "bottom-right",
    captions: [{ at: 0.6, text: "Right content, right time." }], // short enough to clear Tuesday's afternoon block at desktop widths
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
    url: "cms.kiwi.com.ph/layouts",
    // Take: the template picker (naming and resolution already done off camera) → Fullscreen Media →
    // Create → [load, cut] → the empty section is selected → Add image → the 16:9 library file → the
    // canvas fills → Preview. Cut at 3:2: the whole content area (sidebar rail out) for the template
    // step, one push-in to the toolbar + canvas + picker for the media step, a hard cut to the full
    // preview (window centred on the preview content, not the page) for the result. 3:2 because the picker dialog and the canvas only share one window at
    // that height. The footage shows selecting library media, not uploading.
    desktop: {
      src: "/media/designer-light.mp4?v=20260908c",
      poster: "/media/designer-light-poster.jpg?v=20260908c",
      aspect: "3 / 2",
    },
    mobile: {
      src: "/media/designer-light-m.mp4?v=20260908c",
      poster: "/media/designer-light-m-poster.jpg?v=20260908c",
      aspect: "3 / 2",
    },
    captions: [{ at: 0.6, text: "Turn your media into screen-ready layouts." }],
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
                src={row.desktop.src}
                poster={row.desktop.poster}
                aspect={row.desktop.aspect}
                mobile={row.mobile}
                captions={row.captions}
                captionPosition={row.captionPosition}
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
