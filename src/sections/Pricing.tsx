import { Reveal } from "../components/Reveal";
import { CtaLink } from "../components/CtaLink";

/*
 * Plans mirror the platform's plan catalog (kiwi-signage-backend
 * src/modules/plan/domain/plan-catalog.ts) — the same source the in-app
 * Compare Plans page reads. Keep in sync when the catalog changes.
 */
const PLANS = [
  {
    name: "Basic",
    price: "₱0",
    period: "forever",
    tagline: "Free with your display.",
    features: [
      "Up to 5 devices",
      "1 user account",
      "100 MB storage",
      "Images + video",
      "Manual scheduling — up to 10 schedules & 10 campaigns",
      "Device status dashboard",
      "FAQ / self-serve support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₱99",
    period: "per device / month",
    tagline: "Monthly or annual — 1 month free on annual.",
    features: [
      "Up to 10 devices",
      "Up to 5 user accounts, role-based",
      "10 GB storage",
      "Images, video, GIFs, live websites, clocks & more",
      "Advanced scheduling — recurring & dayparting",
      "Up to 30 schedules & 30 campaigns",
      "Full analytics dashboard",
      "90-day activity logs",
      "Priority email + chat support",
    ],
    cta: "Book a demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "₱129",
    period: "per device / month, starts at",
    tagline: "Annual billing — 2 months free, volume pricing.",
    features: [
      "Unlimited devices & users, plus SSO",
      "Storage from 50 GB, scalable",
      "All content types",
      "Advanced scheduling + automation",
      "Custom reporting + export",
      "Full audit trail",
      "Dedicated manager + SLA",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-surface-alt py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
            Pricing
          </p>
        </Reveal>
        <h2
          data-split-reveal className="font-display mt-4 text-4xl leading-[1.02] font-black lowercase sm:text-6xl">
            plans that grow with your fleet
          </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className="h-full">
              <article
                className={`flex h-full flex-col rounded-3xl p-8 ${
                  p.highlight
                    ? "bg-lime-400 text-plum-900 shadow-[0_24px_64px_-16px_rgba(206,237,122,0.35)]"
                    : "border border-line bg-surface-card text-ink"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-black lowercase">
                    {p.name}
                  </h3>
                  {p.highlight && (
                    <span className="font-header rounded-full bg-plum-900 px-3 py-1 text-[10px] font-bold tracking-widest text-lime-400 uppercase">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black">{p.price}</span>
                  <span
                    className={`font-header text-sm ${
                      p.highlight ? "text-plum-800/80" : "text-ink/50"
                    }`}
                  >
                    {p.period}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    p.highlight ? "text-plum-800/90" : "text-ink/60"
                  }`}
                >
                  {p.tagline}
                </p>

                <ul className="mt-7 flex flex-1 flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg
                        viewBox="0 0 16 16"
                        className={`mt-0.5 size-4 shrink-0 ${
                          p.highlight ? "text-plum-900" : "text-accent-text"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <CtaLink
                  href="#cta"
                  variant={p.highlight ? "primary" : "ghost"}
                  className={`mt-8 w-full ${
                    p.highlight
                      ? "!bg-plum-900 !text-lime-400 hover:!bg-plum-800"
                      : ""
                  }`}
                >
                  {p.cta}
                </CtaLink>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="font-header mt-8 text-center text-xs text-ink/70">
            Prices are in Philippine pesos. Annual billing: 1 month free on Pro,
            2 months free on Enterprise.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
