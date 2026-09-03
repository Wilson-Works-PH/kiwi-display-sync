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
  sync. Known deliberate deviation: Pro card omits "PDFs" (the plan's upload
  types + widget flags exclude PDF even though the catalog's marketing row
  mentions it).
- **Don't touch the backend/CMS repos** from here; read-only for facts.

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

- Contact email `contact@wilsonworksph.com` is a best guess — confirm the
  real inbox (old `kiwisolutions.com` domain was retired with the rename).
- `og:image` needs an absolute URL once the production domain exists.
- Grand Royal / Telegraf aren't web-licensed; Fraunces / Instrument Sans are
  the stand-ins. Swap in `src/index.css` + `src/main.tsx` if licensed later.
