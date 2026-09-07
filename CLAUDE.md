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
  Front-facing renders only in the demo wall — rotatable, K-type kiosk and the
  tabletop are shot at an angle and would need a perspective transform.
  **Mobile-first (2026-09-07 brief, ~80% phone traffic):** below `lg` the demo
  is a GUIDED flow (`demo/MobileDemo.tsx`, mounted `key={scenario.id}`): a
  sticky LIVE DISPLAY (real Indoor Digital Display, ~32% of the viewport with
  its header, opening on "Welcome to Kiwi") → CONTROL (2-col content cards that
  only mark "Selected ✓") → TARGET DISPLAY → a 56px PUBLISH TO SCREEN, mirrored
  by a fixed bottom bar while the inline button is off-screen. Publish runs
  Publishing… → Sending to … → Screen syncing… → Published ✓ (~1.4 s,
  `useDemo.publishSequence`) and then the screen changes; success card offers
  "Try another campaign" / "Publish to multiple screens", which reveals the
  screen checklist and, after publishing, swaps the single device for a
  swipeable strip of the whole fleet. Desktop (`lg+`) keeps the side-by-side
  stage; `useMediaQuery` mounts only one. Mobile also gets: compact nav with a
  menu sheet (Product / How it works / Solutions / Pricing / Live demo / Sign
  in), a simplified hero ("Every screen. One Kiwi." + CMS ↓ Kiwi ↓ Display
  visual, "See Kiwi in action" first), feature blocks with visuals instead of
  card stacks, a snap carousel for industries, and a sticky "Book a demo" bar
  that only appears after the visitor scrolls past the demo. All tap targets
  in the demo ≥ 44px. Validate at 360/390/430 with reduced motion; the
  desktop composition must never be squeezed onto phones.

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
