import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx";
import { ContentArt } from "./demo/ContentArt";
import { DashboardFrame } from "./demo/DashboardFrame";
import { DisplayFrame } from "./demo/DisplayWall";
import { SCENARIOS, type ScenarioId } from "./demo/scenarios";
import type { Demo } from "./demo/useDemo";

const DEMO_MAIL = "mailto:contact@wilsonworksph.com?subject=Kiwi%20demo%20request";
const PRICING_MAIL = "mailto:contact@wilsonworksph.com?subject=Kiwi%20pricing%20request";

/* ------------------------------------------------------------------ atoms */

function Button({ href, variant = "primary", children, className }: { href: string; variant?: "primary" | "secondary" | "ghost"; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold transition-all duration-200 active:translate-y-0",
        variant === "primary" && "bg-lime-400 text-plum-950 shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)] hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-[0_16px_32px_-14px_rgba(45,13,41,0.6)]",
        variant === "secondary" && "bg-plum-950 text-white shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)] hover:-translate-y-0.5 hover:bg-plum-800",
        variant === "ghost" && "text-plum-950 ring-1 ring-plum-950/15 hover:-translate-y-0.5 hover:bg-plum-950/[0.04] hover:ring-plum-950/30",
        className,
      )}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">{children}</p>;
}

function SectionHead({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: ReactNode; sub?: string; align?: "center" | "left" }) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")} data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-plum-950 sm:text-5xl">{title}</h2>
      {sub ? <p className="mt-4 text-[17px] leading-relaxed text-plum-950/65">{sub}</p> : null}
    </div>
  );
}

function Icon({ name, size = 22, filled, className }: { name: string; size?: number; filled?: boolean; className?: string }) {
  return (
    <span className={cx("c-icon", filled && "is-filled", className)} style={{ fontSize: size }} aria-hidden="true">
      {name}
    </span>
  );
}

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/* -------------------------------------------------------------------- nav */

export function CNav() {
  const links = [
    ["#demo", "Demo"],
    ["#features", "Features"],
    ["#how", "How it works"],
    ["#solutions", "Solutions"],
    ["#pricing", "Pricing"],
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-plum-950/[0.06] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Kiwi home">
          <span className="grid size-8 place-items-center rounded-lg bg-plum-950 text-[15px] font-black text-lime-400">k</span>
          <span className="text-[17px] font-bold tracking-tight text-plum-950">kiwi</span>
        </a>
        <nav className="hidden items-center gap-7 text-[14px] font-medium text-plum-950/70 md:flex" aria-label="Primary">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-plum-950">
              {label}
            </a>
          ))}
        </nav>
        <Button href={DEMO_MAIL} className="!px-4 !py-2.5 !text-[13px]">
          Book a demo
        </Button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- hero */

export function CHero({ demo }: { demo: Demo }) {
  const screen = demo.scenario.screens.find((s) => s.orientation === "landscape") ?? demo.scenario.screens[0];
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(206,237,122,0.35),transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-5 pt-20 pb-16 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div data-reveal className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-plum-950/70 ring-1 ring-plum-950/10 shadow-sm">
            <span className="c-pulse size-1.5 rounded-full bg-leaf-600" aria-hidden="true" />
            Cloud digital signage CMS
          </div>
          <h1 data-reveal style={delay(80)} className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.04em] text-plum-950 sm:text-[72px]">
            Every screen. <span className="text-leaf-600">One platform.</span>
          </h1>
          <p data-reveal style={delay(160)} className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-plum-950/65 sm:text-[19px]">
            Manage, schedule, and publish digital signage across all your screens from one simple dashboard.
          </p>
          <div data-reveal style={delay(240)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={DEMO_MAIL}>
              Book a demo
              <Icon name="arrow_forward" size={18} />
            </Button>
            <Button href="#demo" variant="ghost">
              <Icon name="play_circle" size={18} />
              See Kiwi in action
            </Button>
          </div>
        </div>

        {/* Product mockup — the same components as the live demo, playing on their own. */}
        <div data-reveal style={delay(320)} className="relative mx-auto mt-16 grid max-w-[1120px] items-end gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <DashboardFrame demo={demo} interactive={false} />
          </div>
          <div className="min-w-0 lg:pb-6">
            <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
              <Icon name="tv" size={16} />
              {screen.location} · {screen.name}
            </div>
            <DisplayFrame screen={screen} demo={demo} interactive={false} />
            <p className="mt-4 text-[13px] text-plum-950/55">
              Playing exactly what the dashboard scheduled.{" "}
              <a href="#demo" className="font-semibold text-plum-950 underline decoration-lime-400 decoration-2 underline-offset-4">
                Try it yourself ↓
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

export function CTrust() {
  const facts = [
    ["cloud_sync", "One dashboard, every location"],
    ["android", "Runs on Android screens and players"],
    ["screen_rotation", "Landscape and portrait, any size"],
    ["groups", "Teams, roles and folder permissions"],
  ] as const;
  return (
    <section className="border-y border-plum-950/[0.06] bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <p data-reveal className="mx-auto max-w-2xl text-center text-[20px] font-medium leading-snug text-plum-950 sm:text-[24px]">
          Kiwi gives your team one place to control what every screen shows, across every branch, floor and city, without touching a single device.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([icon, text], i) => (
            <li key={text} data-reveal style={delay(i * 70)} className="flex items-center gap-3 rounded-2xl bg-[#f6f9ee] px-4 py-3.5 text-[14px] font-semibold text-plum-950/80">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-plum-950 shadow-sm ring-1 ring-plum-950/[0.06]">
                <Icon name={icon} size={20} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- features */

export function CFeatures() {
  const items = [
    ["photo_library", "Content management", "Images, video and PDFs in permissioned folders, with your own brand fonts."],
    ["playlist_play", "Playlists", "Rotate layouts with per-item durations and transitions."],
    ["calendar_month", "Scheduling", "Calendar, repeats and dayparts put the right message in the right hour."],
    ["publish", "Remote publishing", "Push once. Every targeted screen updates within seconds."],
    ["devices", "Screen management", "Pair in seconds, see status live, act remotely when something's off."],
    ["location_on", "Multiple locations", "Group screens by branch, floor or zone and target them together."],
  ] as const;
  return (
    <section id="features" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="Features" title="Everything your screens need." sub="Six capabilities that cover the whole loop, from upload to what's playing right now." />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([icon, title, body], i) => (
            <li key={title} data-reveal style={delay((i % 3) * 80)} className="group rounded-2xl border border-plum-950/[0.08] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]">
              <span className="grid size-11 place-items-center rounded-xl bg-lime-400/40 text-plum-950 transition-colors group-hover:bg-lime-400">
                <Icon name={icon} size={22} />
              </span>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight text-plum-950">{title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-plum-950/65">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ how it works */

export function CHowItWorks() {
  const steps = [
    ["upload", "Upload", "Drop your images, videos and PDFs into the library."],
    ["design_services", "Create", "Build a layout or start from a template."],
    ["ads_click", "Assign", "Choose the screens, groups and schedule."],
    ["publish", "Publish", "Kiwi syncs every screen. Done."],
  ] as const;
  return (
    <section id="how" className="scroll-mt-20 bg-[#f6f9ee] py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="How it works" title="Four steps. No site visits." />
        <ol className="mt-14 grid gap-4 md:grid-cols-4">
          {steps.map(([icon, title, body], i) => (
            <li key={title} data-reveal style={delay(i * 90)} className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum-950/[0.06]">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-plum-950 text-lime-400">
                  <Icon name={icon} size={22} />
                </span>
                <span className="text-[13px] font-bold text-plum-950/35">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight text-plum-950">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-plum-950/65">{body}</p>
              {i < steps.length - 1 ? (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-plum-950/25 md:block" aria-hidden="true">
                  <Icon name="arrow_forward" size={20} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- use cases */

export function CUseCases({ onPick }: { onPick: (id: ScenarioId) => void }) {
  return (
    <section id="solutions" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="Solutions" title="Built for the places screens live." sub="Every card loads that industry's scenario into the live demo above." />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((s, i) => {
            const hero = s.content[0];
            return (
              <li key={s.id} data-reveal style={delay(i * 80)}>
                <a
                  href="#demo"
                  onClick={() => onPick(s.id)}
                  className="group block overflow-hidden rounded-2xl border border-plum-950/[0.08] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ containerType: "inline-size" }}>
                    <ContentArt kind={hero.kind} art={hero.art} />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-bold text-plum-950 shadow">
                      <Icon name={s.icon} size={15} />
                      {s.label}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-bold tracking-tight text-plum-950">{s.label}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-plum-950/65">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-plum-950 transition-colors group-hover:text-leaf-600">
                      Try the {s.label.toLowerCase()} demo
                      <Icon name="arrow_forward" size={16} />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- benefits */

export function CBenefits() {
  const items = [
    ["public", "Manage remotely", "Change what a screen in another city shows without leaving your desk."],
    ["schedule", "Save time", "Schedule once and let dayparts and repeats do the rest, every day."],
    ["verified", "Stay consistent", "The same approved content, branch to branch, screen to screen."],
    ["trending_up", "Scale easily", "Adding a screen is a claim code and one click, not a new workflow."],
  ] as const;
  return (
    <section className="bg-plum-950 py-24 text-cream-100 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-2xl" data-reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime-400">Why teams switch</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">Outcomes, not chores.</h2>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([icon, title, body], i) => (
            <li key={title} data-reveal style={delay(i * 80)} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.09]">
              <span className="grid size-11 place-items-center rounded-xl bg-lime-400 text-plum-950">
                <Icon name={icon} size={22} />
              </span>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-cream-100/70">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

export function CPricing() {
  const tiers = [
    { name: "Starter", blurb: "For a handful of screens in one location.", points: ["Up to 5 screens", "Content library and layouts", "Manual scheduling", "Self-serve help"], featured: false },
    { name: "Business", blurb: "For growing teams across several locations.", points: ["More screens and users", "Playlists, dayparts and repeats", "Website, clock, QR and PDF widgets", "Priority support"], featured: true },
    { name: "Enterprise", blurb: "For large fleets that need it all.", points: ["Unlimited screens", "Unlimited schedules and campaigns", "Full audit trail", "Dedicated manager and SLA"], featured: false },
  ];
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="Pricing" title="Plans that grow with your fleet." sub="Tell us how many screens and locations you run and we'll put a number on it." />
        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <li
              key={t.name}
              data-reveal
              style={delay(i * 90)}
              className={cx(
                "relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1",
                t.featured ? "bg-plum-950 text-white shadow-[0_32px_64px_-32px_rgba(45,13,41,0.6)]" : "border border-plum-950/[0.08] bg-white hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]",
              )}
            >
              {t.featured ? <span className="absolute right-6 top-6 rounded-full bg-lime-400 px-2.5 py-1 text-[11px] font-bold text-plum-950">Most popular</span> : null}
              <h3 className="text-[22px] font-bold tracking-tight">{t.name}</h3>
              <p className={cx("mt-1.5 text-[14.5px]", t.featured ? "text-cream-100/70" : "text-plum-950/65")}>{t.blurb}</p>
              <ul className="mt-6 flex flex-col gap-2.5 text-[14.5px]">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Icon name="check_circle" size={18} filled className={t.featured ? "text-lime-400" : "text-leaf-600"} />
                    <span className={t.featured ? "text-cream-100/90" : "text-plum-950/80"}>{p}</span>
                  </li>
                ))}
              </ul>
              <Button href={PRICING_MAIL} variant={t.featured ? "primary" : "ghost"} className="mt-8 w-full">
                Request pricing
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- final cta */

export function CFinalCta() {
  return (
    <section className="bg-[#f6f9ee] py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-reveal className="relative overflow-hidden rounded-[28px] bg-lime-400 px-6 py-16 text-center shadow-[0_32px_64px_-32px_rgba(45,13,41,0.5)] sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/30" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-plum-950/10" aria-hidden="true" />
          <h2 className="relative text-4xl font-bold tracking-[-0.03em] text-plum-950 sm:text-[56px] sm:leading-[1.02]">See Kiwi on your screens.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[17px] text-plum-950/75">A 20-minute walkthrough on your own content, with your own screens if you have them.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button href={DEMO_MAIL} variant="secondary">
              Book a demo
              <Icon name="arrow_forward" size={18} />
            </Button>
            <Button href={PRICING_MAIL} variant="ghost" className="bg-white/60 ring-plum-950/20 hover:bg-white">
              Request pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- footer */

export function CFooter() {
  const cols: [string, [string, string][]][] = [
    ["Product", [["#demo", "Live demo"], ["#features", "Features"], ["#how", "How it works"], ["#pricing", "Pricing"]]],
    ["Solutions", [["#solutions", "Retail"], ["#solutions", "Restaurants"], ["#solutions", "Corporate"], ["#solutions", "Government"]]],
    ["Company", [["https://kiwi.wilsonworksph.com", "Sign in to Kiwi"], [DEMO_MAIL, "Book a demo"], [PRICING_MAIL, "Request pricing"], ["mailto:contact@wilsonworksph.com", "Contact"]]],
  ];
  return (
    <footer className="border-t border-plum-950/[0.08] bg-white py-14">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="#top" className="flex items-center gap-2.5" aria-label="Kiwi home">
            <span className="grid size-8 place-items-center rounded-lg bg-plum-950 text-[15px] font-black text-lime-400">k</span>
            <span className="text-[17px] font-bold tracking-tight text-plum-950">kiwi</span>
          </a>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-plum-950/60">Cloud digital signage by Kiwi Technologies. Manage, schedule and publish to every screen from one dashboard.</p>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-plum-950/50">{title}</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] text-plum-950/75">
              {links.map(([href, label]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-plum-950">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-plum-950/[0.08] px-5 pt-6 text-[12.5px] text-plum-950/50 sm:px-8">
        <span>© {new Date().getFullYear()} Kiwi Technologies. All rights reserved.</span>
        <span>Made in the Philippines</span>
      </div>
    </footer>
  );
}
