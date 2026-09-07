import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  useRef,
} from "react";
import { cx } from "./cx";
import iconKPlum from "../assets/brand/icon-k-plum.webp";
import iconKLime from "../assets/brand/icon-k-lime.webp";
import wordmarkPlum from "../assets/brand/wordmark-plum.webp";
import lockupPlum from "../assets/brand/lockup-plum.webp";
import sliceHalfLime from "../assets/brand/slice-half-lime.png";
import sliceFullPurple from "../assets/brand/slice-full-purple.png";
import seedsPlum from "../assets/brand/seeds-plum.png";
import seedsLime from "../assets/brand/seeds-lime.png";
import { ContentArt } from "./demo/ContentArt";
import { DashboardFrame } from "./demo/DashboardFrame";
import { DEVICES, fitWidth, type DeviceId } from "./demo/devices";
import { useDevicePanel } from "./demo/useDevicePanel";
import { DisplayFrame } from "./demo/DisplayWall";
import { SCENARIOS, type ContentItem, type ScenarioId } from "./demo/scenarios";
import type { Demo } from "./demo/useDemo";

// Real channels, read off kiwi.com.ph (2026-09-07): its "Request a Demo" / "Get Started"
// buttons go to /contact/, the site's email is info@kiwi.com.ph, and the CMS lives at
// kiwi.wilsonworksph.com.
const DEMO_LINK = "https://kiwi.com.ph/contact/";
const SALES_LINK =
  "mailto:info@kiwi.com.ph?subject=Kiwi%20Enterprise%20pricing";
const CONTACT_EMAIL = "info@kiwi.com.ph";
const PHONES: [string, string][] = [
  ["+63 969 170 2299", "tel:+639691702299"],
  ["+63 2 8658 6962", "tel:+63286586962"],
];
const SOCIALS: [string, string, string][] = [
  ["Facebook", "https://www.facebook.com/kiwitechnologiesph", "thumb_up"],
  [
    "Instagram",
    "https://www.instagram.com/kiwitechnologiesph/",
    "photo_camera",
  ],
  ["YouTube", "https://www.youtube.com/@KiwiTechnologiesPH", "play_circle"],
  [
    "LinkedIn",
    "https://www.linkedin.com/company/kiwi-technologies-ph-display-solution/",
    "work",
  ],
];
const SIGN_IN = "https://kiwi.wilsonworksph.com";

/* ------------------------------------------------------------------ atoms */

function Button({
  href,
  variant = "primary",
  children,
  className,
  onClick,
}: {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cx(
        "font-header inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold transition-all duration-200 active:translate-y-0 active:scale-[0.99]",
        variant === "primary" &&
          "bg-lime-400 text-plum-950 shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)] lg:hover:-translate-y-0.5 lg:hover:bg-lime-300",
        variant === "secondary" &&
          "bg-plum-950 text-white shadow-[0_10px_24px_-12px_rgba(45,13,41,0.6)] lg:hover:-translate-y-0.5 lg:hover:bg-plum-800",
        variant === "ghost" &&
          "text-plum-950 ring-1 ring-plum-950/15 lg:hover:-translate-y-0.5 lg:hover:bg-plum-950/[0.04]",
        className,
      )}
    >
      {children}
    </a>
  );
}

function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "font-header text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** The official lockup: icon logo + wordmark PNGs from the designer kit (never type-set). */
function Logo({
  className,
  mark = "plum",
}: {
  className?: string;
  mark?: "plum" | "lime";
}) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <img
        src={mark === "plum" ? iconKPlum : iconKLime}
        alt=""
        width={200}
        height={192}
        className="h-8 w-auto"
        draggable={false}
      />
      <img
        src={wordmarkPlum}
        alt="Kiwi"
        width={344}
        height={120}
        className={cx(
          "h-[15px] w-auto translate-y-px",
          mark === "lime" && "brightness-0 invert",
        )}
        draggable={false}
      />
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl lg:mx-auto lg:text-center" data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-plum-950 sm:text-4xl lg:mt-3 lg:text-5xl">
        {title}
      </h2>
      {sub ? (
        <p className="mt-3 text-[15.5px] leading-relaxed text-plum-950/65 lg:text-[17px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function Icon({
  name,
  size = 22,
  filled,
  className,
}: {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx("c-icon", filled && "is-filled", className)}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

const delay = (ms: number) =>
  ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** A Kiwi device render with content composited into its panel — no demo state needed. */
function StaticDevice({
  device,
  content,
  badge,
  className,
  fitHeight,
}: {
  device: DeviceId;
  content: ContentItem;
  badge?: string;
  className?: string;
  /**
   * Fit the render into a cell of this height (px): portrait units fill the
   * height, landscape units fill the width — so mixed orientations sit in
   * equal cells instead of one dictating a shared height. See devices.ts
   * `fitWidth`.
   */
  fitHeight?: number;
}) {
  const dev = DEVICES[device];
  const frameRef = useRef<HTMLDivElement>(null);
  const panelStyle = useDevicePanel(dev, frameRef);
  return (
    <div
      ref={frameRef}
      className={cx("relative", className)}
      style={{
        aspectRatio: `${dev.w} / ${dev.h}`,
        width: fitHeight ? fitWidth(dev, fitHeight) : undefined,
      }}
    >
      <img
        src={dev.src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
        style={{ filter: "drop-shadow(0 18px 24px rgba(45,13,41,0.2))" }}
      />
      <div className="absolute overflow-hidden bg-[#1a0718]" style={panelStyle}>
        <ContentArt kind={content.kind} art={content.art} />
        {badge ? (
          <span className="absolute right-[3%] top-[3%] flex items-center gap-1 rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-plum-950 shadow">
            <Icon name="check_circle" size={12} filled />
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- nav */

export function CNav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["#features", "Product"],
    ["#how", "How it works"],
    ["#solutions", "Solutions"],
    ["#pricing", "Pricing"],
  ] as const;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="font-header sticky top-0 z-50 border-b border-plum-950/[0.06] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-8 lg:h-16">
        <a
          href="#top"
          className="flex min-h-[44px] items-center gap-2.5"
          aria-label="Kiwi home"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>
        <nav
          className="hidden items-center gap-7 text-[14px] font-medium text-plum-950/70 lg:flex"
          aria-label="Primary"
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-plum-950"
            >
              {label}
            </a>
          ))}
          <a href="#demo" className="transition-colors hover:text-plum-950">
            Demo
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            href={DEMO_LINK}
            className="!min-h-[40px] !px-3.5 !py-2 !text-[13px] lg:!min-h-[44px] lg:!px-4"
          >
            Book a demo
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="c-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full text-plum-950 ring-1 ring-plum-950/12 lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>
      <div
        id="c-mobile-menu"
        hidden={!open}
        className="border-t border-plum-950/[0.06] bg-white lg:hidden"
      >
        <ul className="mx-auto max-w-[1280px] px-4 py-2 sm:px-8">
          {[...links, ["#demo", "Live demo"], [SIGN_IN, "Sign in"]].map(
            ([href, label]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-between border-b border-plum-950/[0.06] text-[16px] font-semibold text-plum-950 last:border-b-0"
                >
                  {label}
                  <Icon
                    name={
                      href.startsWith("http") ? "open_in_new" : "arrow_forward"
                    }
                    size={18}
                    className="text-plum-950/40"
                  />
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- hero */

export function CHero({ demo }: { demo: Demo }) {
  const screen =
    demo.scenario.screens.find((s) => s.orientation === "landscape") ??
    demo.scenario.screens[0];
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(206,237,122,0.35),transparent_70%)] lg:h-[520px]"
        aria-hidden="true"
      />
      {/* Brand kit: a kiwi slice peeking in at the corner and a seed splash — the design's hero motifs. */}
      <img
        src={sliceHalfLime}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-8 w-[132px] -rotate-[24deg] select-none opacity-90 sm:-right-12 sm:w-[200px] lg:-right-6 lg:top-16 lg:w-[300px]"
      />
      <img
        src={seedsPlum}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 top-[300px] w-16 rotate-12 select-none opacity-25 sm:w-24 lg:left-12 lg:top-40 lg:w-28"
      />
      <div className="relative mx-auto max-w-[1280px] px-5 pt-7 pb-8 sm:px-8 sm:pt-16 lg:pt-28 lg:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div data-reveal className="mx-auto flex justify-center lg:hidden">
            <img
              src={iconKPlum}
              alt=""
              width={200}
              height={192}
              className="h-12 w-auto"
              draggable={false}
            />
          </div>
          <div
            data-reveal
            className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-plum-950/70 shadow-sm ring-1 ring-plum-950/10 lg:inline-flex"
          >
            <span
              className="c-pulse size-1.5 rounded-full bg-leaf-600"
              aria-hidden="true"
            />
            Cloud digital signage CMS
          </div>
          <h1
            data-reveal
            style={delay(80)}
            className="mt-5 text-[40px] font-bold leading-[1.02] tracking-[-0.04em] text-plum-950 sm:text-[56px] lg:mt-6 lg:text-[72px]"
          >
            Every screen.{" "}
            <span className="whitespace-nowrap text-leaf-600">
              <span className="lg:hidden">One Kiwi.</span>
              <span className="hidden lg:inline">One platform.</span>
            </span>
          </h1>
          <p
            data-reveal
            style={delay(160)}
            className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-plum-950/65 lg:mt-6 lg:text-[19px]"
          >
            <span className="lg:hidden">
              Manage and publish digital content to all your displays from one
              place.
            </span>
            <span className="hidden lg:inline">
              Manage, schedule, and publish digital signage across all your
              screens from one simple dashboard.
            </span>
          </p>
          {/* Phones lead with the demo; desktop leads with the sales CTA. */}
          <div
            data-reveal
            style={delay(240)}
            className="mt-7 flex flex-col gap-3 lg:hidden"
          >
            <Button href="#demo" className="w-full !min-h-[52px] !text-[16px]">
              <Icon name="play_circle" size={20} filled />
              See Kiwi in action
            </Button>
            <Button
              href={DEMO_LINK}
              variant="ghost"
              className="w-full !min-h-[52px] !text-[16px]"
            >
              Book a demo
            </Button>
          </div>
          <div
            data-reveal
            style={delay(240)}
            className="mt-8 hidden flex-wrap items-center justify-center gap-3 lg:flex"
          >
            <Button href={DEMO_LINK}>
              Book a demo
              <Icon name="arrow_forward" size={18} />
            </Button>
            <Button href="#demo" variant="ghost">
              <Icon name="play_circle" size={18} />
              See Kiwi in action
            </Button>
          </div>
        </div>

        {/* Phones: CMS → Kiwi → display, top to bottom. */}
        <div
          data-reveal
          style={delay(320)}
          className="mx-auto mt-8 flex max-w-[360px] flex-col items-center lg:hidden"
        >
          <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-plum-950/10 shadow-[0_18px_40px_-24px_rgba(45,13,41,0.45)]">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-plum-950 text-lime-400">
              <Icon name="dashboard" size={22} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-plum-950/50">
                CMS
              </span>
              <span className="block text-[14.5px] font-bold text-plum-950">
                Your Kiwi dashboard
              </span>
            </span>
            <span className="ml-auto flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-7 w-5 rounded-[5px] ring-1 ring-plum-950/10"
                  style={{ background: ["#ceed7a", "#3d0d37", "#96507e"][i] }}
                />
              ))}
            </span>
          </div>
          <FlowArrow />
          <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-plum-950/10 shadow-[0_18px_40px_-24px_rgba(45,13,41,0.45)]">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime-400 text-plum-950">
              <Icon name="cloud" size={22} filled />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-plum-950/50">
                Kiwi
              </span>
              <span className="block text-[14.5px] font-bold text-plum-950">
                Publishes to every screen
              </span>
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-[#4f6b3a]">
              <span
                className="c-pulse size-1.5 rounded-full bg-leaf-600"
                aria-hidden="true"
              />
              Live
            </span>
          </div>
          <FlowArrow />
          <div className="w-full rounded-2xl bg-[#f6f9ee] p-3 ring-1 ring-plum-950/[0.06]">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-plum-950/50">
              <span>Display</span>
              <span>
                {screen.location} · {screen.name}
              </span>
            </div>
            <div className="mx-auto max-w-[260px]">
              <DisplayFrame
                screen={screen}
                demo={demo}
                interactive={false}
                priority
                showLabel={false}
              />
            </div>
          </div>
        </div>

        {/* Desktop: the product mockup, playing on its own. */}
        <div
          data-reveal
          style={delay(320)}
          className="relative mx-auto mt-16 hidden max-w-[1120px] items-end gap-6 lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
        >
          <div className="min-w-0">
            <DashboardFrame demo={demo} interactive={false} />
          </div>
          <div className="min-w-0 pb-6">
            <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-plum-950/55">
              <Icon name="tv" size={16} />
              {screen.location} · {screen.name}
            </div>
            <DisplayFrame
              screen={screen}
              demo={demo}
              interactive={false}
              priority
              showLabel={false}
            />
            <p className="mt-4 text-[13px] text-plum-950/55">
              Playing exactly what the dashboard scheduled.{" "}
              <a
                href="#demo"
                className="font-semibold text-plum-950 underline decoration-lime-400 decoration-2 underline-offset-4"
              >
                Try it yourself ↓
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowArrow() {
  return (
    <div
      className="flex h-9 flex-col items-center justify-center"
      aria-hidden="true"
    >
      <span className="h-5 border-l-2 border-dashed border-leaf-600/70" />
      <Icon
        name="keyboard_arrow_down"
        size={18}
        className="-mt-1 text-leaf-600"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ trust */

export function CTrust() {
  const facts = [
    ["cloud_sync", "One dashboard, every location"],
    ["android", "Runs on Kiwi Android displays"],
    ["screen_rotation", "Landscape and portrait, any size"],
    ["groups", "Teams, roles and permissions"],
  ] as const;
  return (
    <section className="border-y border-plum-950/[0.06] bg-white py-12 lg:py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <p
          data-reveal
          className="max-w-2xl text-[19px] font-medium leading-snug text-plum-950 lg:mx-auto lg:text-center lg:text-[24px]"
        >
          One place to control what every screen shows, across every branch,
          floor and city.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-2.5 lg:mt-10 lg:grid-cols-4 lg:gap-3">
          {facts.map(([icon, text], i) => (
            <li
              key={text}
              data-reveal
              style={delay(i * 60)}
              className="flex items-center gap-2.5 rounded-2xl bg-[#f6f9ee] px-3 py-3 text-[13px] font-semibold leading-snug text-plum-950/80 lg:px-4 lg:text-[14px]"
            >
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
  const retail = SCENARIOS[0];
  const cards = [
    [
      "photo_library",
      "Content management",
      "Images, video and PDFs in permissioned folders, with your own brand fonts.",
    ],
    [
      "playlist_play",
      "Campaigns & playlists",
      "Campaigns rotate layouts with durations and transitions; playlists sequence content inside a zone.",
    ],
    [
      "calendar_month",
      "Scheduling",
      "Calendar, repeats and dayparts put the right message in the right hour.",
    ],
    [
      "publish",
      "Remote publishing",
      "Push once. Every targeted screen updates within seconds.",
    ],
    [
      "devices",
      "Screen management",
      "Pair in seconds, see status live, act remotely when something's off.",
    ],
    [
      "location_on",
      "Multiple locations",
      "Group screens by branch, floor or zone and target them together.",
    ],
  ] as const;
  return (
    <section
      id="features"
      className="scroll-mt-14 bg-white py-14 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="Features" title="Everything your screens need." />

        {/* Phones and tablets: big visual, headline, one line — one feature at a time. */}
        <div className="mt-6 flex flex-col gap-8 lg:hidden">
          <FeatureBlock
            title="Everything in one place."
            body="Manage your images, videos and campaigns from one library."
          >
            <div className="grid grid-cols-2 gap-2 p-3">
              {retail.content.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-plum-950/10"
                  style={{ containerType: "inline-size" }}
                >
                  <ContentArt kind={c.kind} art={c.art} />
                </div>
              ))}
            </div>
          </FeatureBlock>
          <FeatureBlock
            title="Right content. Right time."
            body="Schedule exactly when your campaigns should appear, down to the hour."
          >
            <ul className="flex flex-col gap-2 p-3">
              {SCENARIOS[1].schedules.map((s, i) => (
                <li
                  key={s.id}
                  className={cx(
                    "flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 ring-1",
                    i === 1 ? "ring-leaf-600" : "ring-plum-950/10",
                  )}
                >
                  <span className="w-[92px] shrink-0 font-mono text-[12px] font-semibold text-plum-950/70">
                    {s.when}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-plum-950">
                    {s.name}
                  </span>
                  <span
                    className={cx(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                      i === 1
                        ? "bg-leaf-600 text-white"
                        : "bg-plum-950/[0.05] text-plum-950/60",
                    )}
                  >
                    {i === 1 ? "Active" : "Scheduled"}
                  </span>
                </li>
              ))}
            </ul>
          </FeatureBlock>
          <FeatureBlock
            title="Publish from anywhere."
            body="Push once and every targeted screen updates within seconds."
          >
            <div className="mx-auto max-w-[320px] p-5">
              <StaticDevice
                device="indoor-display"
                content={retail.content[0]}
                badge="Published"
              />
            </div>
          </FeatureBlock>
          <FeatureBlock
            title="Every screen, every location."
            body="Group screens by branch, floor or zone and see their status live."
          >
            <div className="flex items-end justify-center gap-4 p-5">
              <div className="w-[38%]">
                <StaticDevice
                  device="indoor-display"
                  content={retail.content[1]}
                />
                <Loc label="Makati" />
              </div>
              <div className="w-[18%]">
                <StaticDevice
                  device="floor-standing"
                  content={retail.content[3]}
                />
                <Loc label="BGC" />
              </div>
              <div className="w-[38%]">
                <StaticDevice
                  device="indoor-display"
                  content={retail.content[2]}
                />
                <Loc label="Cebu" />
              </div>
            </div>
          </FeatureBlock>
        </div>

        {/* Desktop: the six capabilities as a grid. */}
        <ul className="mt-14 hidden gap-5 lg:grid lg:grid-cols-3">
          {cards.map(([icon, title, body], i) => (
            <li
              key={title}
              data-reveal
              style={delay((i % 3) * 80)}
              className="group rounded-2xl border border-plum-950/[0.08] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-lime-400/40 text-plum-950 transition-colors group-hover:bg-lime-400">
                <Icon name={icon} size={22} />
              </span>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight text-plum-950">
                {title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-plum-950/65">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeatureBlock({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div data-reveal>
      <div className="overflow-hidden rounded-3xl bg-[#f6f9ee] ring-1 ring-plum-950/[0.06]">
        {children}
      </div>
      <h3 className="mt-4 text-[22px] font-bold leading-tight tracking-[-0.02em] text-plum-950">
        {title}
      </h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-plum-950/65">
        {body}
      </p>
    </div>
  );
}

function Loc({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center justify-center gap-1 text-[10.5px] font-semibold text-plum-950/60">
      <span className="size-1.5 rounded-full bg-leaf-600" aria-hidden="true" />
      {label}
    </div>
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
  const [active, setActive] = useState(0);
  return (
    <section
      id="how"
      className="scroll-mt-14 bg-[#f6f9ee] py-12 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="How it works"
          title="Upload → Create → Assign → Publish."
        />

        {/* Phones: the demo already taught the loop, so this is one compact row — tap a step for its line. */}
        <div className="mt-6 lg:hidden" data-reveal>
          <ol className="flex items-stretch gap-1">
            {steps.map(([icon, title], i) => (
              <li
                key={title}
                className="flex min-w-0 flex-1 items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cx(
                    "flex min-h-[64px] w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors",
                    active === i
                      ? "bg-plum-950 text-lime-400"
                      : "bg-white text-plum-950/70 ring-1 ring-plum-950/10",
                  )}
                >
                  <Icon name={icon} size={20} />
                  {title}
                </button>
                {i < steps.length - 1 ? (
                  <Icon
                    name="arrow_forward"
                    size={14}
                    className="shrink-0 text-plum-950/35"
                  />
                ) : null}
              </li>
            ))}
          </ol>
          <p
            className="c-rise-in mt-3 rounded-2xl bg-white px-4 py-3 text-[14px] leading-snug text-plum-950/75 ring-1 ring-plum-950/[0.06]"
            key={active}
          >
            <span className="font-bold text-plum-950">{steps[active][1]}.</span>{" "}
            {steps[active][2]}
          </p>
        </div>

        {/* Desktop: four cards. */}
        <ol className="mt-14 hidden gap-4 lg:grid lg:grid-cols-4">
          {steps.map(([icon, title, body], i) => (
            <li
              key={title}
              data-reveal
              style={delay(i * 80)}
              className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum-950/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-plum-950 text-lime-400">
                  <Icon name={icon} size={22} />
                </span>
                <span className="text-[13px] font-bold text-plum-950/35">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight text-plum-950">
                {title}
              </h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-plum-950/65">
                {body}
              </p>
              {i < steps.length - 1 ? (
                <span
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-plum-950/25 lg:block"
                  aria-hidden="true"
                >
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
    <section
      id="solutions"
      className="scroll-mt-14 bg-white py-14 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Solutions"
          title="Built for the places screens live."
          sub="Every industry loads its own scenario into the live demo."
        />

        {/* Phones and tablets: swipe through the industries, each on a real Kiwi unit. */}
        <div
          className="c-snap c-scroll -mx-5 mt-8 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden"
          aria-label="Industries"
        >
          {SCENARIOS.map((s) => {
            const screen = s.screens[0];
            return (
              <article
                key={s.id}
                className="w-[84%] shrink-0 overflow-hidden rounded-3xl bg-[#f6f9ee] ring-1 ring-plum-950/[0.06] sm:w-[60%]"
              >
                <div className="flex h-[300px] items-end justify-center px-6 pt-6">
                  <StaticDevice
                    device={screen.device}
                    content={s.content[0]}
                    fitHeight={276}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-leaf-600">
                    <Icon name={s.icon} size={16} />
                    {s.label}
                  </div>
                  <h3 className="mt-1 text-[20px] font-bold tracking-tight text-plum-950">
                    {s.workspace}
                  </h3>
                  <p className="mt-1 text-[14px] leading-snug text-plum-950/65">
                    {s.blurb}
                  </p>
                  <a
                    href="#demo"
                    onClick={() => onPick(s.id)}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-plum-950 px-4 text-[14px] font-bold text-white"
                  >
                    Try the {s.label.toLowerCase()} demo
                    <Icon name="arrow_forward" size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[12px] text-plum-950/45 lg:hidden">
          Swipe for more →
        </p>

        {/* Desktop grid. */}
        <ul className="mt-14 hidden gap-5 lg:grid lg:grid-cols-4">
          {SCENARIOS.map((s, i) => {
            const hero = s.content[0];
            return (
              <li key={s.id} data-reveal style={delay(i * 80)}>
                <a
                  href="#demo"
                  onClick={() => onPick(s.id)}
                  className="group block overflow-hidden rounded-2xl border border-plum-950/[0.08] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ containerType: "inline-size" }}
                  >
                    <ContentArt kind={hero.kind} art={hero.art} />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-bold tracking-tight text-plum-950">
                      {s.label}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-plum-950/65">
                      {s.blurb}
                    </p>
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
    [
      "public",
      "Manage remotely",
      "Change a screen in another city without leaving your desk.",
    ],
    [
      "schedule",
      "Save time",
      "Schedule once; dayparts and repeats do the rest.",
    ],
    [
      "verified",
      "Stay consistent",
      "The same approved content, branch to branch.",
    ],
    [
      "trending_up",
      "Scale easily",
      "A new screen is a claim code and one click.",
    ],
  ] as const;
  return (
    <section className="relative overflow-hidden bg-plum-950 py-14 text-cream-100 lg:py-28">
      <img
        src={sliceFullPurple}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-[260px] rotate-12 select-none opacity-60 lg:-bottom-40 lg:-right-10 lg:w-[460px]"
      />
      <img
        src={seedsLime}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 top-4 w-16 -rotate-12 select-none opacity-40 lg:right-16 lg:top-12 lg:w-24"
      />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-2xl" data-reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime-400">
            Why teams switch
          </p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:mt-3 lg:text-5xl">
            Outcomes, not chores.
          </h2>
        </div>
        <ul className="mt-8 flex flex-col gap-3 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-5">
          {items.map(([icon, title, body], i) => (
            <li
              key={title}
              data-reveal
              style={delay(i * 70)}
              className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 lg:block lg:p-6"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime-400 text-plum-950">
                <Icon name={icon} size={22} />
              </span>
              <div className="min-w-0 lg:mt-5">
                <h3 className="text-[17px] font-bold tracking-tight text-white lg:text-[18px]">
                  {title}
                </h3>
                <p className="mt-0.5 text-[14px] leading-snug text-cream-100/70 lg:mt-2 lg:text-[14.5px] lg:leading-relaxed">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

export function CPricing() {
  // Mirrors kiwi-signage-backend plan-catalog.ts (the same rows the product's own Plans page shows).
  const tiers = [
    {
      name: "Basic",
      price: "₱0",
      per: "forever",
      billing: "Free with your Kiwi display",
      blurb: "Get your first screens running.",
      points: [
        "Up to 5 devices",
        "1 user account",
        "100 MB storage",
        "Images and video",
        "Manual scheduling · 10 schedules, 10 campaigns",
        "FAQ and self-serve help",
      ],
      cta: "Book a demo",
      featured: false,
    },
    {
      name: "Pro",
      price: "₱99",
      per: "/ device / month",
      billing: "Monthly or annual · 1 month free on annual",
      blurb: "For teams running several screens.",
      points: [
        "Up to 10 devices",
        "Up to 5 users, role-based",
        "10 GB storage",
        "Images, video, GIFs, live websites, PDFs, clocks and QR codes",
        "Advanced scheduling: recurring and dayparts · 30 schedules, 30 campaigns",
        "90-day activity log",
        "Priority email and chat support",
      ],
      cta: "Book a demo",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "From ₱129",
      per: "/ device / month",
      billing: "Annual · 2 months free · volume pricing",
      blurb: "For large fleets across many sites.",
      points: [
        "Unlimited devices and users",
        "From 50 GB storage, scalable",
        "All content types",
        "Unlimited schedules and campaigns",
        "Full audit trail",
        "Dedicated account manager and SLA",
      ],
      cta: "Talk to sales",
      featured: false,
    },
  ];
  return (
    <section
      id="pricing"
      className="scroll-mt-14 bg-white py-14 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Pricing"
          title="Plans that grow with your fleet."
          sub="Priced per device, per month. Basic is free with your Kiwi display."
        />
        <ul className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {tiers.map((t, i) => (
            <li
              key={t.name}
              data-reveal
              style={delay(i * 80)}
              className={cx(
                "relative flex flex-col rounded-2xl p-6 transition-all duration-300 lg:p-7 lg:hover:-translate-y-1",
                t.featured
                  ? "bg-plum-950 text-white shadow-[0_32px_64px_-32px_rgba(45,13,41,0.6)]"
                  : "border border-plum-950/[0.08] bg-white",
              )}
            >
              {t.featured ? (
                <span className="absolute right-5 top-5 rounded-full bg-lime-400 px-2.5 py-1 text-[11px] font-bold text-plum-950">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-[22px] font-bold tracking-tight">{t.name}</h3>
              <p
                className={cx(
                  "mt-1 text-[14.5px]",
                  t.featured ? "text-cream-100/70" : "text-plum-950/65",
                )}
              >
                {t.blurb}
              </p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[36px] font-bold leading-none tracking-[-0.03em]">
                  {t.price}
                </span>
                <span
                  className={cx(
                    "text-[13px] font-semibold",
                    t.featured ? "text-cream-100/70" : "text-plum-950/60",
                  )}
                >
                  {t.per}
                </span>
              </div>
              <p
                className={cx(
                  "mt-1.5 text-[12.5px]",
                  t.featured ? "text-cream-100/60" : "text-plum-950/55",
                )}
              >
                {t.billing}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Icon
                      name="check_circle"
                      size={18}
                      filled
                      className={cx(
                        "mt-px shrink-0",
                        t.featured ? "text-lime-400" : "text-leaf-600",
                      )}
                    />
                    <span
                      className={
                        t.featured ? "text-cream-100/90" : "text-plum-950/80"
                      }
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                href={t.name === "Enterprise" ? SALES_LINK : DEMO_LINK}
                variant={t.featured ? "primary" : "ghost"}
                className="mt-6 w-full lg:mt-8"
              >
                {t.cta}
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-[12.5px] text-plum-950/50">
          Prices in Philippine pesos. Displays are sold separately.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- final cta */

export function CFinalCta() {
  return (
    <section className="bg-[#f6f9ee] py-14 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[28px] bg-lime-400 px-6 py-12 text-center shadow-[0_32px_64px_-32px_rgba(45,13,41,0.5)] sm:px-12 lg:py-16"
        >
          <img
            src={sliceFullPurple}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 w-[170px] -rotate-12 select-none opacity-90 lg:-bottom-32 lg:-left-16 lg:w-[300px]"
          />
          <img
            src={seedsPlum}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-6 w-20 rotate-[30deg] select-none opacity-70 lg:right-10 lg:top-8 lg:w-28"
          />
          <h2 className="relative text-[32px] font-bold leading-[1.02] tracking-[-0.03em] text-plum-950 sm:text-[44px] lg:text-[56px]">
            See Kiwi on your screens.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-[15.5px] text-plum-950/75 lg:mt-4 lg:text-[17px]">
            A 20-minute walkthrough on your own content.
          </p>
          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:mt-8">
            <Button
              href={DEMO_LINK}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Book a demo
              <Icon name="arrow_forward" size={18} />
            </Button>
            <Button
              href="#pricing"
              variant="ghost"
              className="w-full bg-white/90 ring-plum-950/20 sm:w-auto lg:hover:bg-white"
            >
              See pricing
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
    [
      "Product",
      [
        ["#demo", "Live demo"],
        ["#features", "Features"],
        ["#how", "How it works"],
        ["#pricing", "Pricing"],
      ],
    ],
    [
      "Solutions",
      [
        ["#solutions", "Retail"],
        ["#solutions", "Restaurants"],
        ["#solutions", "Corporate"],
        ["#solutions", "Government"],
      ],
    ],
    [
      "Company",
      [
        ["https://kiwi.com.ph", "kiwi.com.ph"],
        [DEMO_LINK, "Book a demo"],
        [SIGN_IN, "Sign in to Kiwi"],
        [`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL],
      ],
    ],
  ];
  return (
    <footer className="border-t border-plum-950/[0.08] bg-white py-12 pb-28 lg:py-14">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <a
            href="#top"
            className="flex items-center gap-2.5"
            aria-label="Kiwi home"
          >
            <img
              src={lockupPlum}
              alt="Kiwi Technologies"
              width={304}
              height={160}
              className="h-12 w-auto"
              draggable={false}
            />
          </a>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-plum-950/60">
            Digital display systems and the cloud CMS that runs them, by Kiwi
            Technologies.
          </p>
          <ul className="mt-4 flex flex-col gap-1 text-[13.5px] text-plum-950/70">
            {PHONES.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-[40px] items-center gap-2 lg:min-h-0 lg:py-0.5"
                >
                  <Icon name="call" size={16} className="text-plum-950/45" />
                  {label}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2 pt-1">
              <Icon
                name="storefront"
                size={16}
                className="mt-0.5 text-plum-950/45"
              />
              <span>
                Showroom · Greenhills, San Juan, Metro Manila · Mon–Fri, 9 AM–5
                PM
              </span>
            </li>
          </ul>
          <ul
            className="mt-4 flex gap-2"
            aria-label="Kiwi Technologies on social media"
          >
            {SOCIALS.map(([name, href, icon]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="grid size-11 place-items-center rounded-full text-plum-950/70 ring-1 ring-plum-950/10 lg:size-10"
                >
                  <Icon name={icon} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 md:contents">
          {cols.map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-plum-950/50">
                {title}
              </h4>
              <ul className="mt-3 flex flex-col text-[14px] text-plum-950/75 lg:mt-4">
                {links.map(([href, label]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex min-h-[40px] items-center break-all transition-colors hover:text-plum-950 lg:min-h-0 lg:py-1"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-plum-950/[0.08] px-5 pt-6 text-[12.5px] text-plum-950/50 sm:px-8 lg:mt-12">
        <span>
          © {new Date().getFullYear()} Kiwi Technologies. All rights reserved.
        </span>
        <span>PhilGEPS Platinum registered · Made in the Philippines</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------- sticky sales CTA */

/**
 * Phones only: a small Book-a-demo bar that appears once the visitor has
 * scrolled past the live demo, and stays out of the way while the demo (and
 * its Publish button) is on screen.
 */
export function CStickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const demo = document.getElementById("demo");
    if (!demo) return;
    const update = () => {
      const r = demo.getBoundingClientRect();
      setShow(r.bottom < 0 && window.innerWidth < 1024);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      className={cx(
        "c-safe-bottom fixed inset-x-0 bottom-0 z-30 px-4 pt-2 transition-all duration-300 lg:hidden",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-[520px] items-center gap-3 rounded-full bg-plum-950/95 p-1.5 pl-4 text-white shadow-[0_18px_40px_-16px_rgba(45,13,41,0.6)] backdrop-blur">
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
          Ready to see it on your screens?
        </span>
        <a
          href={DEMO_LINK}
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-lime-400 px-4 text-[14px] font-bold text-plum-950"
        >
          Book a demo
          <Icon name="arrow_forward" size={16} />
        </a>
      </div>
    </div>
  );
}
