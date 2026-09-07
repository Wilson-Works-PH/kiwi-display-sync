# Kiwi Display Sync — marketing site

One-page marketing site for the Kiwi digital-signage platform (the product in
the adjacent `../kiwi-signage-frontend` + `../kiwi-signage-backend` repos).
Built 2026-09-03. Vite + React 19 + TypeScript + Tailwind 4 — deliberately the
same toolchain as the CMS frontend.

## Ground rules

- **Brand is law.** Colors in `src/index.css` were *sampled* from the brand
  proposal (`brand/…Brand Proposal.pdf`, pages 5 & 8) — never tweak hexes by
  eye. Company name is **Kiwi Technologies** (the 2023 proposal's "Kiwi Retail
  Solutions" is retired; the newest designer lockup says "kiwi technologies").
- **Copy must be true.** Every feature claim was verified against the CMS
  codebase. Don't add claims for SSO, public API, RSS widgets, or analytics
  dashboards — those are plan flags without shipped UI. Crash reports, fault
  history, countdown clocks, six layout templates, snapping and undo/redo ARE
  real — don't remove them as "too good to be true".
- **Pricing mirrors** `kiwi-signage-backend/src/modules/plan/domain/plan-catalog.ts`
  (Basic ₱0 · Pro ₱99/device/mo · Enterprise from ₱129/device/mo). Keep in
  sync. Since 2026-09-04 (backend PR #133) Pro DOES include PDF uploads and the
  PDF widget — the old "Pro omits PDFs" deviation is obsolete; Concept B's
  pricing card still needs the PDF line moved from Enterprise to Pro.
- **Don't touch the backend/CMS repos** from here; read-only for facts.

## Concepts, one repo

**Concept C is the site** (2026-09-07, user decision): `/` renders it. Concepts
A and B are hidden — still routable at `/a` and `/b` for team comparison, not
linked from anywhere; the floating `VariantSwitch` is no longer mounted
(`src/components/VariantSwitch.tsx` kept for reference).

- `/a` — **Concept A** (`src/pages/Classic.tsx` + `src/sections/*`): plum/lime,
  Fraunces, theme toggle, GSAP/Lenis motion.
- `/b` — **Concept B** (`src/concept-b/*`): 1:1 implementation of the
  "Kiwi Site.dc.html" prototype from the Claude Design project
  (314fd7cf-a26b-4f84-bad6-4eb8f50616be). Paper `#F1EDE1` / ink `#2C1830` /
  berry `#9D3A6A` / lime `#B7D24F`; Newsreader + Hanken Grotesk + Material
  Symbols Rounded (all self-hosted via Fontsource). Its motion runtime is a
  direct port of the prototype's script (`src/concept-b/b-motion.ts`): custom
  cursor + lime blob, word cascade, IO reveals + counters, condensing nav that
  inverts over dark sections, scroll-driven 3D card stage, tilt cards,
  magnetic buttons, viewport-centered parallax. Concept B owns its palette —
  the site theme toggle does not apply there.

Deliberate deviations from the design file (don't "restore" them):
pricing uses the real plan catalog numbers; Pro's widget line predates PDFs
moving to Pro (backend PR #133, 2026-09-04) — update both concepts' pricing copy; footer/company is Kiwi Technologies with
contact@wilsonworksph.com (design had kiwi.com placeholders and the retired
"Retail Solutions" name); demo links go to kiwi.wilsonworksph.com.
Hero stats (1,284 screens / 96% online) are still the design's aspirational
numbers — pending a decision.

- `/` (also `/c`) — **Concept C** (`src/concept-c/*`, built 2026-09-07 from the user's
  brief): modern light-only SaaS page whose centerpiece is an **interactive
  demo simulation** — a mock Kiwi dashboard (left) driving three simulated
  screens (right) through a dashboard → cloud → screens connector. Pure
  front-end state: `demo/scenarios.ts` holds four industry presets (retail,
  restaurant, corporate, government: screens, content, playlists, schedules,
  defaults); `demo/useDemo.ts` is the reducer + timers (push → `syncing` →
  `synced`/`published`, staggered fleet publishes, shared 3.2 s playlist
  tick); `demo/ContentArt.tsx` draws every piece of "content" from a
  description in container-query units (no stock imagery), so the same art
  is a thumbnail in the dashboard and full-bleed on a screen. The hero
  mockup is the same components in a second, non-interactive `useDemo`
  instance. Brand mapping for the brief's "green accent": lime `#CEED7A`
  buttons with plum text, leaf `#7FA060` for accents/status, plum `#2D0D29`
  for text; Instrument Sans throughout. Scoped styles in `c.css`; the site
  theme toggle does not apply. Pricing is the brief's Starter / Business /
  Enterprise with "Request pricing" (no numbers) — NOTE the real plans are
  Basic / Pro / Enterprise; bullets stay within the catalog's truths.
  Contact links (Concept C): "Book a demo" → https://kiwi.com.ph/contact/ (the
  company site's own Request-a-Demo page), sales → mailto:info@kiwi.com.ph, phones
  +63 969 170 2299 / +63 2 8658 6962, showroom Greenhills, San Juan (Mon–Fri
  9–5), socials @kiwitechnologiesph — all read off kiwi.com.ph on 2026-09-07.
  Concepts A/B still use the older guessed contact@wilsonworksph.com.
  **Device renders** (`src/assets/devices/*.webp`, `demo/devices.ts`) are Kiwi's
  own product renders from kiwi.com.ph/digital-solutions (transparent PNGs →
  trimmed webp), with each screen panel's rectangle measured in % so the demo
  composites live content into the real hardware. The site sits behind a
  "Checking your browser" bot check: curl gets 403/429, but a Playwright page
  that has passed the check can `fetch()` the uploads with cookies; render an
  `<img>` on a transparent same-origin page and element-screenshot it with
  `omitBackground` to keep alpha (there is no `fs` inside run_code snippets).
  Rotatable, K-type kiosk and the tabletop stay out of the demo wall (no
  corners measured yet); the E-Poster and outdoor totem ARE angled and get the
  homography described under Mobile-first.
  **Mobile-first (2026-09-07 briefs, ~80% phone traffic):** below `lg` the
  page order is hero → demo → benefit statement (desktop keeps trust strip →
  demo; `CPage` swaps them with `useMediaQuery`). The demo is a GUIDED flow
  (`demo/MobileDemo.tsx`, mounted `key={scenario.id}`): a large in-flow
  LIVE DISPLAY — the scenario's first screen, for retail the portrait
  **Indoor Digital E-Poster** "Storefront 01" at `min(44vh, 400px)` — opening
  on "Welcome to Kiwi"; as it scrolls out, a COMPACT STICKY PREVIEW (124px
  under the 56px header, zero flow footprint via negative margin, IO-driven)
  shows the same screen as a 16:9 panel + "LIVE · Storefront 01" + status
  chip, and stays until the demo leaves the middle of the viewport. CONTROL:
  2-col content cards that only mark "✓ SELECTED" (plum 3px ring, lift, plum
  footer) — selection never touches the live screen — then TARGET DISPLAY,
  then a 56px contextual publish button: neutral "Publish to screen" until a
  pick, then lime `Publish "50% off" → Storefront 01`, mirrored by a fixed
  bottom bar while the inline button is off-screen. Publish runs Publishing…
  → Sending to Storefront 01… → Screen syncing… → Published ✓ (~1.4 s,
  `useDemo.publishSequence`, lime pulse on both previews, SYNCING chip) and
  the screen changes in both; no auto-scroll; success card "Published to
  Storefront 01 ✓" offers "Try another campaign" / "Publish to multiple
  screens", and "Now update every screen." reveals the checklist; after that
  publish the single device becomes a swipeable strip of the fleet. "How it
  works" on phones is one tappable UPLOAD → CREATE → ASSIGN → PUBLISH row
  (desktop keeps the four cards). Desktop (`lg+`) keeps the side-by-side
  stage; `useMediaQuery` mounts only one. Mobile also has the compact nav +
  menu sheet, the simplified hero, feature blocks, the industry snap carousel
  (~20 % of the next card peeks) and a sticky "Book a demo" past the demo.
  All demo tap targets ≥ 44px. Validate at 360/390/430 with reduced motion;
  the desktop composition must never be squeezed onto phones.
  **Mixed orientations never share a height (user, 2026-09-07: "mixing vertical
  with horizontal… very large difference in the height"):** wherever devices
  sit in a row — the industry carousel, the fleet strip, the desktop wall's
  portrait side — each render is fitted into an equal CELL via
  `devices.ts fitWidth(dev, cellHeight)` (portrait fills the height, landscape
  is capped at the cell width, bottom-aligned so units stand on one floor).
  Never size a row by a common height: a landscape unit as tall as a totem is
  wider than a phone. Every scenario's fleet is TWO landscape + ONE portrait
  screen (portrait first for retail, it's the phone demo's hero unit) — the
  desktop wall's stacked-landscapes-beside-one-standing-unit composition only
  balances for that shape, so keep it when adding scenarios.
  **Angled renders are projected, not pasted:** `devices.ts` entries with
  `quad` (E-Poster, outdoor totem) carry the screen's four corners; the shared
  `demo/useDevicePanel.ts` (used by `DisplayFrame` AND `StaticDevice`) lays
  the content out flat at its on-screen size and applies a 4-point homography
  (`demo/homography.ts` → `matrix3d`) measured through a ResizeObserver
  (`useElementSize`). Corners were found by masking saturated wallpaper
  pixels (`sat > 28`) and taking the extreme points — redo that if a render
  is re-trimmed; never hand-tweak the numbers.
  **Brand kit + type roles (2026-09-07, user: "do not forget about the
  assets… follow fonts in the design"):** the nav, hero, footer, dashboard
  mock and Kiwi's welcome screen use the designer's real PNG/webp logos from
  `src/assets/brand/` (`icon-k-plum` / `icon-k-lime` icon logos, `wordmark-plum`,
  `lockup-plum` "kiwi technologies", `icon-circle-lime`, `wordmark-lime`) —
  never type-set "k"/"kiwi". Slices (`slice-half-lime`, `slice-full-purple`)
  and seed splashes (`seeds-plum`, `seeds-lime`) decorate the hero, the plum
  benefits band and the lime CTA card, kept clear of text. Type follows the
  brand roles via `c.css`: Lato body (root), Fraunces (Grand Royal stand-in)
  on h1–h4 with `SOFT 30`, Instrument Sans (Telegraf stand-in) on buttons,
  nav, eyebrows and everything inside `#demo`; customer content in
  `ContentArt` stays Instrument Sans (it's *their* signage), only the
  `brand: "kiwi"` welcome card takes the brand kit.

Any static deploy needs an SPA fallback (all paths → index.html) for `/a` and `/b`.

## Architecture

- `src/index.css` — raw brand tokens (`@theme`) + semantic theme tokens
  (`@theme inline` over `--t-*` vars) that flip via `data-theme="light"` on
  `<html>`. Toggle in the nav; persisted as `kds:theme`; pre-paint inline
  script in `index.html` prevents FOUC. Fixed-brand surfaces (marquee band,
  CTA band, footer, pricing highlight card) keep literal plum/lime in both
  themes — don't "semanticize" them.
- `src/components/MotionRoot.tsx` — Lenis smooth scroll + GSAP/ScrollTrigger.
  Declarative data attributes: `data-parallax`, `data-marquee-band`,
  `data-split-reveal` (masked line reveal), `data-split-chars`,
  `data-shot-reveal` (screenshot unclip), `data-magnetic`,
  `data-hscroll`/`data-hscroll-track` (pinned horizontal product tour,
  ≥1024px only). SplitText masks clip descenders at tight leading, so every
  split **reverts on animation complete** — keep that pattern.
- `src/components/Preloader.tsx` — once-per-session intro (`kds:intro-seen`
  in sessionStorage). `src/components/HeroSeeds.tsx` — lazy Three.js seed
  field behind the hero. Everything respects `prefers-reduced-motion`.
- `Wordmark` is **type-set** (Fraunces + seed PNG accent), not a logo image —
  the PNG wordmark stretched inside flex columns and blurred at nav size.

## Real-app media

Screenshots (`src/assets/media/*.webp`, dark + `-light` variants) and
recordings (`public/media/*.mp4` + posters, dark + `-light`) are captures of
the **real CMS** at `kiwi.wilsonworksph.com`, tenant *Wilson Works Trading
Inc.* — not mockups; the "watch it work" section's whole pitch depends on
that. Capture pipeline: headless `playwright-core` + system Chrome + session
cookies, CMS theme forced via `localStorage kiwi:theme`; trim/encode with
ffmpeg. Ask the user for credentials each time; the account belongs to two
workspaces, so handle the `/select-workspace` screen.

## Verification

`npm run build && npm run lint` after every change. Full-page Playwright
screenshots show blank sections below the fold — that's an artifact (Lenis
smoothing + IntersectionObserver never firing during stitched capture), not a
bug; verify with stepped viewport screenshots or `reducedMotion: 'reduce'`
emulation instead.

## Known open items

- Concept C uses info@kiwi.com.ph + kiwi.com.ph/contact/ (from the company
  site). Concepts A/B still carry the guessed `contact@wilsonworksph.com`.
- `og:image` needs an absolute URL once the production domain exists.
- Grand Royal / Telegraf aren't web-licensed; Fraunces / Instrument Sans are
  the stand-ins. Swap in `src/index.css` + `src/main.tsx` if licensed later.
