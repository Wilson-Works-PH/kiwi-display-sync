import { Reveal } from "../components/Reveal";
import seedsMauve from "../assets/brand/seeds-mauve.png";

const STEPS = [
  {
    title: "pair your screens",
    body: "Install the Kiwi player on any Android display, open it, and type your workspace claim code. The screen pops up as pending — one click authorizes it into your fleet.",
  },
  {
    title: "design & schedule",
    body: "Start from a template or a blank canvas, drop in your content, and put it on the calendar. Campaigns rotate layouts; dayparts keep the right message in the right hours.",
  },
  {
    title: "sync & relax",
    body: "Content flows to every targeted screen and plays on schedule — groups can even play in lockstep. Watch it all live from the dashboard, wherever you are.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8">
      <Reveal>
        <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
          How it works
        </p>
        </Reveal>
        <h2
          data-split-reveal className="font-display mt-4 text-4xl leading-[1.02] font-black lowercase sm:text-6xl">
          from box to broadcast in{" "}
          <span className="text-accent-text">three steps</span>
        </h2>

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 120}>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="font-display grid size-12 place-items-center rounded-full bg-lime-400 text-xl font-black text-plum-900">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <img
                    src={seedsMauve}
                    alt=""
                    aria-hidden="true"
                    width={642}
                    height={616}
                    className="hidden w-6 md:block"
                  />
                )}
              </div>
              <h3 className="font-display mt-5 text-2xl font-black lowercase">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
