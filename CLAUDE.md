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
"Retail Solutions" name); demo links go to kiwi.wilsonworksph.com (Concepts A/B); Concept C shows and links cms.kiwi.com.ph (user, 2026-09-07).
Hero stats (1,284 screens / 96% online) are still the design's aspirational
numbers — pending a decision.

- `/` (also `/c`) — **Concept C** (`src/concept-c/*`): modern light-only SaaS
  page that SHOWS the real product, roommaster.com-style (user decision
  2026-09-07 after finding the interactive simulation "confusing"). Hero =
  a recording of the real CMS in a browser frame (`VideoFrame.tsx`: muted,
  looping, plays only while on screen, poster-only under reduced motion);
  "See Kiwi in action" (`CShowcase.tsx`, section `#demo`) = one recording per
  job, text/frame rows alternating. **All four clips are REAL recordings made
  2026-09-07 on the local stack** (`public/media/{hero,displays,schedule,designer}-light.mp4`
  + posters; raw takes in gitignored `public/media/raw/`): hero = Displays →
  Storefront 01 → Content → Choose layout → default updates; displays = fleet +
  Display Groups; schedule = week + Dayparts; designer = Media → Layouts → New
  layout (HD Landscape, Fullscreen Media) → Add image → Preview (×1.25). The
  image must be exactly 16:9 ("Still - Video Wall", 800×450) — a 16:10 file gets
  cropped by the section and the user rejected that frame.
  Re-record with `scripts/record-cms.mjs --clip <name>` (see "Recording the
  CMS on LOCAL") and `scripts/encode-clip.sh`; the sidecar `raw/<clip>.json`
  carries the warm-up trim point. The interactive
  demo engine (useDemo, MobileDemo, DashboardFrame, ConnectionFlow,
  DisplayWall, StatusChip) is DELETED — don't resurrect it. What remains of
  `demo/`: `scenarios.ts` (industry copy + drawn content), `ContentArt.tsx`,
  `devices.ts` + `homography.ts` + `useDevicePanel.ts` (real Kiwi renders
  with content projected onto the measured screen quad), used by the hero-free
  `StaticDevice` in the industries carousel and the features section.
  Brand mapping: lime `#CEED7A` buttons with plum text, leaf `#7FA060`
  accents/status, plum `#2D0D29` text. Pricing = the real Basic / Pro /
  Enterprise catalog, all three tiers on identical cards with the same button and NO
  "Most popular" badge or inverted card (team feedback 2026-09-07: "do not force them to
  go to Pro"). Footer socials use real brand SVGs (`BRAND_PATHS`), not Material stand-ins. Contact links: "Book a demo" → https://kiwi.com.ph/contact/,
  sales → mailto:info@kiwi.com.ph, phones +63 969 170 2299 / +63 2 8658 6962,
  showroom Greenhills, San Juan (Mon–Fri 9–5), socials @kiwitechnologiesph —
  all read off kiwi.com.ph on 2026-09-07. Concepts A/B still use the older
  guessed contact@wilsonworksph.com.
  **Device renders** (`src/assets/devices/*.webp`, `demo/devices.ts`) are Kiwi's
  own product renders from kiwi.com.ph/digital-solutions (transparent PNGs →
  trimmed webp). Angled renders (E-Poster, outdoor totem) carry the screen's
  four corners (`quad`) and get a real perspective projection; front-facing
  ones use the rectangle. Corners were measured by masking saturated wallpaper
  pixels (`sat > 28`) — redo that if a render is re-trimmed. The site sits
  behind a "Checking your browser" bot check: curl gets 403/429, but a
  Playwright page that has passed the check can `fetch()` the uploads.
  **Mixed orientations never share a height:** rows of devices (industries
  carousel) fit each render into an equal cell via `devices.ts fitWidth`.
  Every scenario's fleet is two landscape + one portrait screen.
  **Brand kit + type roles:** real designer logos from `src/assets/brand/`
  (`icon-k-plum`/`icon-k-lime`, `wordmark-plum`, `lockup-plum`,
  `icon-circle-lime`, `wordmark-lime`) — never type-set "k"/"kiwi"; slices and
  seeds on the hero, plum band and CTA card; type via `c.css`: Lato body,
  Fraunces (Grand Royal stand-in) h1–h4, Instrument Sans (Telegraf stand-in)
  on buttons, nav, eyebrows and `#demo`. `.gitignore` anchors `/brand` to the
  root so `src/assets/brand/` stays tracked.
  **Mobile:** compact nav + menu sheet, hero video full-width under the CTAs,
  showcase rows stacked, industries as a snap carousel, sticky "Book a demo"
  after `#demo`. Validate at 360/390/430 and 1440 after every change.

  "How it works" (`CHowItWorks.tsx`) is TEXT ONLY: four steps as cards in a row on desktop, a plain list on phones, heading kept on one line (`lg:whitespace-nowrap`, set outside SectionHead whose column width wrapped it). Three treatments were rejected 2026-09-07: a tappable strip, thumbnail-topped cards, and a step tour with a large real-CMS frame ("it doesn't need screenshots" — the recordings above already show the product).

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

## Recording the CMS on LOCAL (2026-09-07, user decision: "record on local so we have full control")

Production can't be used (the APK fleet is production-only), so the clips are recorded against the
dev stack: backend on :3000 (Atlas `kiwi-cms-dev-local`), and a **production build of the CMS
frontend served by `vite preview` on :4173** (`npm run build && npx vite preview --port 4173` in
`../kiwi-signage-frontend`) — the :5173 dev server shows TanStack devtools badges and is the user's;
never kill it. Cookies come from the MCP browser's logged-in localhost session →
`.secrets/cms-storage-state.json` (gitignored; cookies ignore ports, so :5173's session works on :4173).
`scripts/record-cms.mjs` boots at "/" and clicks the sidebar (deep links bounce to /dashboard),
runs every flow once QUIETLY first (warm-up: primes queries + images so nothing loads on camera;
the designer flow's warm-up layout is deleted again; the hero's default layout is cleared), reloads
and waits for network-idle + no skeletons, then records the take with a drawn cursor at 1440×900 →
`public/media/raw/<clip>.webm` + a JSON sidecar with the on-camera start second. Cookies: export
`context.storageState()` from the MCP browser RIGHT BEFORE recording
(`.secrets/cms-storage-state.json`) — better-auth rotates the session token, a stale file lands on
the login page;
`scripts/encode-clip.sh raw out start end [speed]` → mp4 + poster. Displays are **simulated
players** on the real /player API (see the frontend memory recipe): "Storefront 01"
(SIM-PORTRAIT-0001, 1080x1920), "Counter Display" (SIM-LANDSCAPE-0001), "Window Display"
(SIM-LANDSCAPE-0002); a heartbeat keeper (scratchpad `heartbeat.py`, 90 s) holds them Online;
tokens live only in the session scratchpad — re-register with the same hardwareKey to get new
ones. The user provided the layouts + media in "Home"; I added display groups BY ORIENTATION ("Makati
storefront" = the portrait Storefront 01, "Makati window" = Window Display, "BGC counter" = Counter
Display — never mix orientations in a group, a portrait layout on a landscape screen letterboxes)
and hour-block schedules (the free plan blocks dayparts/recurrence and caps active schedules at 10,
so only Mon–Wed are filled). Sims carry orientation-matched layout previews as screenshots. The industries
carousel and the features section show the user's REAL layout previews (`src/assets/media/layouts/*.webp`,
re-download from the API if layouts change) on devices whose panel RESOLUTION matches the layout
(1080×1920 layouts on the 9:16 totems, 1920×1080 on the Indoor Digital Display — the 3840×2160 layout
is only shown as a layout card, never on a 1080p unit; user: "resolution is not aligned"), letterboxed
(`object-contain`) never cropped; drawn scenario content survives only in `ArtPage` (`/art/:scenario/:index`) as a fallback.
Device screen rects come from a percentile scan of the wallpaper pixels — the Indoor Digital Display
rect was re-measured 2026-09-07 after the user saw thicker top/right bezels.
Projected devices (E-Poster, outdoor totem) lay content out at `screenAspect` (devices.ts), not at the
quad's foreshortened edge lengths — that gave a 0.26 box and black bars. Outdoor = 9/16 (spec); the
E-Poster uses 1488/3840, the ratio of the tall "Kiwi Beauty Clinic" artwork the user made for it (media
"2.png", asset `layouts/kiwi-beauty-clinic.webp`, shown on the retail card) — switch to 9/16 if the
real panel is 1080×1920.

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
