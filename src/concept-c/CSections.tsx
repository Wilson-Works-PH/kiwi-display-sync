import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  useRef,
  type MouseEvent,
} from "react";
import { cx } from "./cx";
import wordmarkLime from "../assets/brand/wordmark-lime.png";
import clientAppleAndEve from "../assets/clients/apple-and-eve.webp";
import clientCardinalSantos from "../assets/clients/cardinal-santos.webp";
import clientCaviteStateUniversity from "../assets/clients/cavite-state-university.webp";
import clientCityGardenGrandHotel from "../assets/clients/city-garden-grand-hotel.webp";
import clientDmw from "../assets/clients/dmw.webp";
import clientGolfx from "../assets/clients/golfx.webp";
import clientAlinoHotel from "../assets/clients/alino-hotel.webp";
import clientMasil from "../assets/clients/masil.webp";
import clientPaperdolls from "../assets/clients/paperdolls.webp";
import featureSchedule from "../assets/media/feature-schedule.webp";
import layoutKiwiTech from "../assets/media/layouts/kiwi-technologies.webp";
import layoutRestaurantL from "../assets/media/layouts/kiwi-restaurant-landscape.webp";
import layoutRestaurant from "../assets/media/layouts/kiwi-restaurant.webp";
import layoutGrandOpening from "../assets/media/layouts/grand-opening.webp";
import layoutClinic from "../assets/media/layouts/kiwi-clinic.webp";
import beautyClinic from "../assets/media/layouts/kiwi-beauty-clinic.webp";
import wordmarkPlum from "../assets/brand/wordmark-plum.webp";
import lockupPlum from "../assets/brand/lockup-plum.webp";
import sliceHalfLime from "../assets/brand/slice-half-lime.png";
import sliceFullPurple from "../assets/brand/slice-full-purple.png";
import seedsPlum from "../assets/brand/seeds-plum.png";
import seedsLime from "../assets/brand/seeds-lime.png";
import { ContentArt } from "./demo/ContentArt";
import { DEVICES, fitWidth, type DeviceId } from "./demo/devices";
import { useDevicePanel } from "./demo/useDevicePanel";
import { SCENARIOS, type ContentItem, type ScenarioId } from "./demo/scenarios";
import { VideoFrame } from "./VideoFrame";

// Real channels, read off kiwi.com.ph (2026-09-07): its "Request a Demo" / "Get Started"
// buttons go to /contact/, the site's email is info@kiwi.com.ph, and the CMS lives at
// cms.kiwi.com.ph.
const DEMO_LINK = "https://kiwi.com.ph/contact/";
const SALES_LINK =
  "mailto:info@kiwi.com.ph?subject=Kiwi%20Enterprise%20pricing";
const CONTACT_EMAIL = "info@kiwi.com.ph";
const PHONES: [string, string][] = [
  ["+63 969 170 2299", "tel:+639691702299"],
  ["+63 2 8658 6962", "tel:+63286586962"],
];
const SOCIALS: [string, string][] = [
  ["Facebook", "https://www.facebook.com/kiwitechnologiesph"],
  ["Instagram", "https://www.instagram.com/kiwitechnologiesph/"],
  ["YouTube", "https://www.youtube.com/@KiwiTechnologiesPH"],
  [
    "LinkedIn",
    "https://www.linkedin.com/company/kiwi-technologies-ph-display-solution/",
  ],
];

/** Brand marks (Material Symbols has none) — the standard 24×24 glyphs, drawn in currentColor. */
const BRAND_PATHS: Record<string, string> = {
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  Instagram:
    "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

function BrandIcon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}
const SIGN_IN = "https://cms.kiwi.com.ph";

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

/**
 * The site logo: the official "kiwi" wordmark PNG with DISPLAY SYNC set underneath —
 * the same treatment the CMS gives its own "CONTENT MANAGEMENT SYSTEM" line. No icon
 * mark (user, 2026-09-07: "I don't like the K").
 */
export function Logo({
  className,
  mark = "plum",
}: {
  className?: string;
  mark?: "plum" | "lime";
}) {
  return (
    <span
      className={cx("inline-flex flex-col items-start leading-none", className)}
    >
      <img
        src={mark === "plum" ? wordmarkPlum : wordmarkLime}
        alt="Kiwi"
        width={344}
        height={120}
        className="h-[22px] w-auto"
        draggable={false}
      />
      <span
        className={cx(
          "font-header mt-[4px] text-[8px] font-bold uppercase tracking-[0.3em]",
          mark === "plum" ? "text-plum-950/65" : "text-cream-100/80",
        )}
      >
        Display Sync
      </span>
    </span>
  );
}

export function SectionHead({
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

export function Icon({
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
  image,
  badge,
  className,
  fitHeight,
}: {
  device: DeviceId;
  /** Drawn demo content (industries carousel)… */
  content?: ContentItem;
  /** …or a real layout preview from the CMS (features). Orientation must match the device. */
  image?: string;
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
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : content ? (
          <ContentArt kind={content.kind} art={content.art} />
        ) : null}
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
  /** Close the sheet, then jump — the body is scroll-locked while it's open, so a plain anchor click wouldn't move. */
  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      document.body.style.overflow = "";
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);
  return (
    <>
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
      </header>
      {/* Phones: a FULL-SCREEN menu (user, 2026-09-07). It covers the page, keeps the logo +
        a close button in the same spot as the bar, lists the destinations large, and ends in
        the sales CTA. Body scroll is locked while it's open. */}
      {open ? (
        <div
          id="c-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="c-fade-in fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
        >
          <div className="flex h-14 items-center justify-between px-4">
            <a
              href="#top"
              aria-label="Kiwi home"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center"
            >
              <Logo />
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full text-plum-950 ring-1 ring-plum-950/12"
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav
            className="flex flex-1 flex-col justify-center px-6"
            aria-label="Menu"
          >
            <ul className="flex flex-col">
              {[...links, ["#demo", "See it in action"]].map(
                ([href, label], i) => (
                  <li
                    key={label}
                    className="c-rise-in border-b border-plum-950/[0.08]"
                    style={delay(i * 40)}
                  >
                    <a
                      href={href}
                      onClick={(e) => go(e, href)}
                      className="flex min-h-[64px] items-center justify-between text-[28px] font-bold tracking-tight text-plum-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {label}
                      <Icon
                        name="arrow_forward"
                        size={22}
                        className="text-plum-950/35"
                      />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="c-safe-bottom flex flex-col gap-3 px-6 pb-6">
            <Button
              href={DEMO_LINK}
              className="w-full !min-h-[52px] !text-[16px]"
            >
              Book a demo
              <Icon name="arrow_forward" size={18} />
            </Button>
            <a
              href={SIGN_IN}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[48px] items-center justify-center gap-1.5 text-[15px] font-semibold text-plum-950/70"
            >
              Sign in to Kiwi Display Sync
              <Icon name="open_in_new" size={16} />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------- hero */

export function CHero() {
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

        {/* The product, for real: a recording of the Kiwi CMS in a browser
            frame (roommaster-style hero, user decision 2026-09-07). Recorded on
            the local stack with scripts/record-cms.mjs and cut around one
            visible change (user, 2026-09-08): Storefront 01 → Content → Change
            layout now → Kiwi Food → the Now playing card, header thumbnail and
            the Overview screenshot all switch; the clip rests on the result.
            Cut with scripts/cut-clip.py: whole page through the Content tab,
            the layout picker and the switch (a mid-clip push-in left the
            picker flush-left with its bottom row on the frame edge — user,
            2026-09-08), then ONE zoom onto the Overview result. Phones get a
            lighter encode of the same cut. */}
        <div
          data-reveal
          style={delay(320)}
          className="mx-auto mt-8 max-w-[1120px] lg:mt-14"
        >
          <VideoFrame
            // The file names are stable across re-records; the query busts browser/CDN caches.
            src="/media/hero-light.mp4?v=20260908c"
            poster="/media/hero-light-poster.jpg?v=20260908c"
            aspect="1600 / 1000"
            mobile={{
              src: "/media/hero-light-m.mp4?v=20260908c",
              poster: "/media/hero-light-m-poster.jpg?v=20260908c",
              aspect: "1600 / 1000",
            }}
            url="cms.kiwi.com.ph/displays"
            label="Switching Storefront 01 to the Kiwi Food layout in the Kiwi CMS — the screen updates"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

/**
 * Client logos supplied by the user (KIWI_CLIENT_LOGO/, 2026-09-08), keyed off their
 * backgrounds and normalised to 120px tall in `src/assets/clients/`. Shown grayscale at
 * reduced opacity, full colour on hover.
 */
const CLIENTS = [
  { name: "Apple & Eve", src: clientAppleAndEve },
  { name: "Cardinal Santos Medical Center", src: clientCardinalSantos },
  { name: "Cavite State University", src: clientCaviteStateUniversity },
  { name: "City Garden Grand Hotel", src: clientCityGardenGrandHotel },
  { name: "Department of Migrant Workers", src: clientDmw },
  { name: "GolfX Philippines", src: clientGolfx },
  { name: "Alino Hotel", src: clientAlinoHotel },
  { name: "Masil Charcoal Grill Restaurant", src: clientMasil },
  { name: "Paperdolls by RGMC", src: clientPaperdolls },
];

function ClientLogo({ name, src }: { name: string; src: string }) {
  return (
    <img
      src={src}
      alt={name}
      title={name}
      height={120}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-8 w-auto max-w-[150px] shrink-0 object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 lg:h-9 lg:max-w-[170px]"
    />
  );
}

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
          className="font-header text-center text-[12px] font-bold uppercase tracking-[0.18em] text-plum-950/50"
          data-reveal
        >
          Trusted by
        </p>
        {/* Phones: an endless marquee (two copies of the row); desktop: one wrapped row. */}
        <div
          className="c-marquee -mx-5 mt-5 overflow-hidden sm:-mx-8 lg:hidden"
          aria-label="Client logos"
        >
          <div className="c-marquee-track gap-10 px-5">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <ClientLogo key={`${c.name}-${i}`} name={c.name} src={c.src} />
            ))}
          </div>
        </div>
        <ul
          className="mt-6 hidden flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:flex"
          data-reveal
        >
          {CLIENTS.map((c) => (
            <li key={c.name}>
              <ClientLogo name={c.name} src={c.src} />
            </li>
          ))}
        </ul>
        <p
          data-reveal
          className="mt-10 max-w-2xl text-[19px] font-medium leading-snug text-plum-950 lg:mx-auto lg:mt-12 lg:text-center lg:text-[24px]"
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

/** Real layouts from the Home workspace (CMS layout previews, 800px webp) — shown the way the Layouts page shows them. */
const REAL_LAYOUTS = [
  { name: "Kiwi Technologies", size: "1920 × 1080", src: layoutKiwiTech },
  {
    name: "Kiwi Restaurant Landscape",
    size: "3840 × 2160",
    src: layoutRestaurantL,
  },
  { name: "Kiwi Restaurant", size: "1080 × 1920", src: layoutRestaurant },
  { name: "Grand Opening", size: "800 × 1280", src: layoutGrandOpening },
];

export function CFeatures() {
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
              {REAL_LAYOUTS.map((l) => (
                <div
                  key={l.name}
                  className="overflow-hidden rounded-xl bg-white ring-1 ring-plum-950/10"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#f6f9ee] p-2">
                    <img
                      src={l.src}
                      alt={`${l.name} layout`}
                      className="max-h-full max-w-full rounded-[3px] shadow-sm"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="truncate text-[12.5px] font-bold text-plum-950">
                      {l.name}
                    </div>
                    <div className="font-header text-[10.5px] text-plum-950/55">
                      {l.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FeatureBlock>
          <FeatureBlock
            title="Right content. Right time."
            body="Schedule exactly when your campaigns should appear, down to the hour."
          >
            <img
              src={featureSchedule}
              alt="The Kiwi schedule: a week of hour-blocked layouts per screen group"
              width={900}
              height={562}
              loading="lazy"
              decoding="async"
              className="w-full rounded-xl ring-1 ring-plum-950/10"
            />
          </FeatureBlock>
          <FeatureBlock
            title="Publish from anywhere."
            body="Push once and every targeted screen updates within seconds."
          >
            <div className="mx-auto max-w-[320px] p-5">
              <StaticDevice
                device="indoor-display"
                image={layoutKiwiTech}
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
                <StaticDevice device="indoor-display" image={layoutKiwiTech} />
                <Loc label="Makati" />
              </div>
              <div className="w-[18%]">
                <StaticDevice
                  device="floor-standing"
                  image={layoutRestaurant}
                />
                <Loc label="BGC" />
              </div>
              <div className="w-[38%]">
                <StaticDevice device="indoor-display" image={layoutKiwiTech} />
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

/* -------------------------------------------------------------- use cases */

/**
 * Industries → the user's real layouts (Home workspace previews) on a device whose
 * panel matches the layout's resolution exactly (user, 2026-09-07: "resolution is
 * not aligned" when a 3840×2160 layout sat on a 1920×1080 unit). Drawn scenario content is no longer shown here (user, 2026-09-07:
 * "it should be using the new layouts that I uploaded").
 */
const INDUSTRY_SHOWCASE: Record<
  ScenarioId,
  { device: DeviceId; image: string }
> = {
  retail: { device: "e-poster", image: beautyClinic }, // the 1488×3840 artwork made for the E-Poster
  restaurant: { device: "floor-standing", image: layoutRestaurant }, // 1080×1920 on a 1080×1920 panel
  corporate: { device: "indoor-display", image: layoutKiwiTech },
  government: { device: "outdoor", image: layoutClinic }, // 1080×1920 on the 9:16 outdoor totem
};

export function CUseCases() {
  return (
    <section
      id="solutions"
      className="scroll-mt-14 bg-white py-14 lg:scroll-mt-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Solutions"
          title="Built for the places screens live."
          sub="Retail, food, offices and public service — each with its own kind of screen."
        />

        {/* Phones and tablets: swipe through the industries, each on a real Kiwi unit. */}
        <div
          className="c-snap c-scroll -mx-5 mt-8 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden"
          aria-label="Industries"
        >
          {SCENARIOS.map((s) => {
            const show = INDUSTRY_SHOWCASE[s.id];
            return (
              <article
                key={s.id}
                className="w-[84%] shrink-0 overflow-hidden rounded-3xl bg-[#f6f9ee] ring-1 ring-plum-950/[0.06] sm:w-[60%]"
              >
                <div className="flex h-[300px] items-end justify-center px-6 pt-6">
                  <StaticDevice
                    device={show.device}
                    image={show.image}
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
            const show = INDUSTRY_SHOWCASE[s.id];
            return (
              <li key={s.id} data-reveal style={delay(i * 80)}>
                <div className="group block overflow-hidden rounded-2xl border border-plum-950/[0.08] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.45)]">
                  <div className="flex aspect-[4/3] items-end justify-center overflow-hidden bg-[#f6f9ee] px-6 pt-6">
                    <StaticDevice
                      device={show.device}
                      image={show.image}
                      fitHeight={200}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-bold tracking-tight text-plum-950">
                      {s.label}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-plum-950/65">
                      {s.blurb}
                    </p>
                  </div>
                </div>
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
        {/* All three tiers get the same card, the same button and no badge — the page
            informs, it doesn't steer (team feedback, 2026-09-07: "do not force them to go
            to Pro"). */}
        <ul className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {tiers.map((t, i) => (
            <li
              key={t.name}
              data-reveal
              style={delay(i * 80)}
              className="flex flex-col rounded-2xl border border-plum-950/[0.08] bg-white p-6 transition-all duration-300 lg:p-7 lg:hover:-translate-y-1 lg:hover:shadow-[0_24px_48px_-28px_rgba(45,13,41,0.35)]"
            >
              <h3 className="text-[22px] font-bold tracking-tight text-plum-950">
                {t.name}
              </h3>
              <p className="mt-1 text-[14.5px] text-plum-950/65">{t.blurb}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[36px] font-bold leading-none tracking-[-0.03em] text-plum-950">
                  {t.price}
                </span>
                <span className="text-[13px] font-semibold text-plum-950/60">
                  {t.per}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-plum-950/55">
                {t.billing}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Icon
                      name="check_circle"
                      size={18}
                      filled
                      className="mt-px shrink-0 text-leaf-600"
                    />
                    <span className="text-plum-950/80">{p}</span>
                  </li>
                ))}
              </ul>
              {/* flex-1 + items-end pins every button to the card's bottom edge so the row lines up; mt-6/8 is the minimum gap above it. */}
              <div className="mt-6 flex flex-1 items-end lg:mt-8">
                <Button
                  href={t.name === "Enterprise" ? SALES_LINK : DEMO_LINK}
                  variant="ghost"
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </div>
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
        ["#demo", "See it in action"],
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
        [SIGN_IN, "Sign in to Kiwi Display Sync"],
        [`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL],
        ["/privacy", "Privacy policy"],
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
          </ul>
          <ul
            className="mt-4 flex gap-2"
            aria-label="Kiwi Technologies on social media"
          >
            {SOCIALS.map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="grid size-11 place-items-center rounded-full text-plum-950/70 ring-1 ring-plum-950/10 transition-colors hover:text-plum-950 lg:size-10"
                >
                  <BrandIcon name={name} size={17} />
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
                      className="flex min-h-[40px] min-w-0 items-center break-words transition-colors hover:text-plum-950 lg:min-h-0 lg:py-1"
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
