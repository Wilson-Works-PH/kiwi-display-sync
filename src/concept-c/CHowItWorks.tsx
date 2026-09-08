import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "./CSections";
import sliceFullPurple from "../assets/brand/slice-full-purple.png";
import seedsLime from "../assets/brand/seeds-lime.png";

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
 * screenshots"). The steps light up one after another on a slow loop while the band
 * is on screen — the site's own way of showing a flow rather than a list (user,
 * 2026-09-08: "tasteful implementation in our own way"); off under reduced motion.
 * Original notes: (user, 2026-09-07: "it doesn't need
 * screenshots" — the recordings right after it show the product; it moved ahead of
 * them on 2026-09-08 as the compact overview). It carries the site's one PLUM band:
 * when the "Why teams switch" band was dropped the page lost its purple/green
 * section, and the user asked to promote another (2026-09-08). The heading
 * is set here rather than through SectionHead so it can stay on ONE line at
 * every width: fluid size on phones, no column cap on desktop.
 */
/** Index of the step currently lit, cycling every `stepMs` while the section is on screen. */
function useStepSequence(ref: React.RefObject<HTMLElement | null>, stepMs = 1400) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (entry.isIntersecting) {
          setActive(0);
          timer = window.setInterval(() => setActive((i) => (i + 1) % STEPS.length), stepMs);
        } else {
          setActive(-1);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [ref, stepMs]);
  return active;
}

export function CHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const active = useStepSequence(sectionRef);
  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative scroll-mt-14 overflow-hidden bg-plum-950 py-12 text-cream-100 lg:scroll-mt-20 lg:py-28"
    >
      {/* Brand art behind the content (the wrapper below is `relative`, so cards always sit above it;
          on phones the list's bottom margin gives the slice its own room). */}
      <img
        src={sliceFullPurple}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-14 w-[200px] rotate-12 select-none opacity-60 lg:-bottom-40 lg:-right-10 lg:w-[460px]"
      />
      <img
        src={seedsLime}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 top-4 w-16 -rotate-12 select-none opacity-40 lg:right-16 lg:top-12 lg:w-24"
      />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="lg:text-center" data-reveal>
          <p className="font-header text-[12px] font-bold uppercase tracking-[0.18em] text-lime-400">
            How it works
          </p>
          <h2 // One line at every width. The text is ~18× its font size wide, so 4.55vw fits the padded box down to
            // 320px; 36px only from md (at 640px it would overflow the box and scroll the page sideways).
            className="mt-2 whitespace-nowrap text-[clamp(14px,4.55vw,30px)] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-4xl lg:mt-3 lg:text-[44px] xl:text-5xl"
          >
            Upload → Create → Assign → Publish.
          </h2>
        </div>

        {/* Phones and tablets: a plain list. */}
        <ol className="mb-16 mt-6 flex flex-col gap-3 lg:hidden">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              data-active={i === active || undefined}
              style={delay(i * 60)}
              className="c-step flex items-start gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10"
            >
              <span className="c-step-tile grid size-11 shrink-0 place-items-center rounded-xl bg-lime-400 text-plum-950">
                <Icon name={step.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-header block text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400/90">
                  Step {i + 1}
                </span>
                <span className="block text-[19px] font-bold leading-tight tracking-tight text-white">
                  {step.title}
                </span>
                <span className="mt-1 block text-[14.5px] leading-snug text-cream-100/70">
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
              data-active={i === active || undefined}
              style={delay(i * 80)}
              className="c-step rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="c-step-tile grid size-11 place-items-center rounded-xl bg-lime-400 text-plum-950">
                  <Icon name={step.icon} size={22} />
                </span>
                <span className="font-header text-[13px] font-bold text-white/35">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-[20px] font-bold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-cream-100/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
