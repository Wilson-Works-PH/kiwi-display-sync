import type { CSSProperties } from "react";
import { Icon } from "./CSections";

const STEPS = [
  {
    icon: "upload",
    title: "Upload",
    body: "Drop images, videos and PDFs into the library.",
  },
  {
    icon: "design_services",
    title: "Create",
    body: "Start from a template and drop media into a section.",
  },
  {
    icon: "ads_click",
    title: "Assign",
    body: "Pick the layout for a screen, a group or a schedule.",
  },
  { icon: "publish", title: "Publish", body: "Kiwi syncs every screen. Done." },
];

const delay = (ms: number) =>
  ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * "How it works": four steps, text only (user, 2026-09-07: "it doesn't need
 * screenshots" — the recordings above already show the product). The heading
 * is set here rather than through SectionHead so it can stay on ONE line at
 * every width: fluid size on phones, no column cap on desktop.
 */
export function CHowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-14 bg-[#f6f9ee] py-12 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="lg:text-center" data-reveal>
          <p className="font-header text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">
            How it works
          </p>
          <h2 // One line at every width. The text is ~18× its font size wide, so 4.55vw fits the padded box down to
            // 320px; 36px only from md (at 640px it would overflow the box and scroll the page sideways).
            className="mt-2 whitespace-nowrap text-[clamp(14px,4.55vw,30px)] font-bold leading-[1.05] tracking-[-0.03em] text-plum-950 md:text-4xl lg:mt-3 lg:text-[44px] xl:text-5xl"
          >
            Upload → Create → Assign → Publish.
          </h2>
        </div>

        {/* Phones and tablets: a plain list. */}
        <ol className="mt-6 flex flex-col gap-3 lg:hidden">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={delay(i * 60)}
              className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-plum-950/[0.06]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-plum-950 text-lime-400">
                <Icon name={step.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-header block text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-600">
                  Step {i + 1}
                </span>
                <span className="block text-[19px] font-bold leading-tight tracking-tight text-plum-950">
                  {step.title}
                </span>
                <span className="mt-1 block text-[14.5px] leading-snug text-plum-950/70">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>

        {/* Desktop: four numbered cards in a row. No connector arrows — a 20px glyph in a
            16px gap straddled the card edges (user: "badly placed"); the heading and
            the 01–04 numbers already carry the order. */}
        <ol className="mt-14 hidden gap-4 lg:grid lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={delay(i * 80)}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum-950/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-plum-950 text-lime-400">
                  <Icon name={step.icon} size={22} />
                </span>
                <span className="font-header text-[13px] font-bold text-plum-950/35">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-[20px] font-bold tracking-tight text-plum-950">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-plum-950/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
