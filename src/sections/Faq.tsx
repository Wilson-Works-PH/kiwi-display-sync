import { Reveal } from "../components/Reveal";

const FAQS = [
  {
    q: "What hardware do I need?",
    a: "Any Android-based display or media box. Install the Kiwi player app, enter your workspace claim code, and the screen shows up in your dashboard as pending — authorize it and you're live. No proprietary hardware, no per-device setup wizardry.",
  },
  {
    q: "What kinds of content can screens play?",
    a: "Seven widget types: text (with your own brand fonts), images, video, live websites, clocks and countdowns, QR codes, and PDFs. Arrange them in multi-zone layouts, chain layouts into campaigns, and add transitions between items.",
  },
  {
    q: "Can multiple screens play in perfect sync?",
    a: "Yes — put displays in a group and flag it for synchronized playback. Members of the group play in lockstep, which is how you drive video walls and matching window displays.",
  },
  {
    q: "How does scheduling actually work?",
    a: "You schedule a layout or campaign to one or more display groups, with a time window and optional recurrence — daily, weekdays, weekly, monthly or fully custom rules. Dayparts add time-of-day fences, and priority events cleanly win any overlap.",
  },
  {
    q: "How do team permissions work?",
    a: "Workspaces have tenant admins, group admins and members. You grant view, edit or delete rights to user groups on folders, displays, layouts, media, schedules and more — and permissions cascade down your folder tree so you set them once.",
  },
  {
    q: "How do I know a screen went dark?",
    a: "Status is pushed live: the moment a player connects or drops, your dashboard flips. Each display keeps a fault history, storage telemetry, and even crash reports from the player, so you can diagnose before you dispatch anyone.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-24 sm:px-8">
      <Reveal>
        <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
          FAQ
        </p>
        </Reveal>
        <h2
          data-split-reveal className="font-display mt-4 text-4xl leading-[1.02] font-black lowercase sm:text-6xl">
          you asked, we answered
        </h2>

      <div className="mt-12 flex flex-col gap-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 60}>
            <details className="group rounded-2xl border border-line bg-surface-alt open:border-accent-text/50">
              <summary className="font-header flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-accent-text transition-transform duration-300 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-ink/70">
                {f.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
