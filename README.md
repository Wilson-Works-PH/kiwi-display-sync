# Kiwi Display Sync — marketing site

One-page marketing site for the Kiwi digital-signage platform, built with the
same toolchain as the CMS frontend: **Vite + React 19 + TypeScript + Tailwind 4**.

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
npm run lint      # eslint
```

## Themes & motion

- **Light/dark**: semantic tokens in `src/index.css` flip via `data-theme="light"`
  on `<html>` (toggle in the nav, persisted as `kds:theme`, stamped pre-paint by
  an inline script in `index.html`). Screenshots and recordings swap per theme.
- **Motion**: Lenis smooth scroll + GSAP/ScrollTrigger (`src/components/MotionRoot.tsx`)
  drive masked heading reveals, screenshot unclips, scroll parallax, a
  velocity-skewed marquee, magnetic CTAs, and the pinned horizontal product
  tour (desktop only). `src/components/Preloader.tsx` is the once-per-session
  intro; `src/components/HeroSeeds.tsx` is a lazy-loaded Three.js seed field.
  Everything respects `prefers-reduced-motion`.

## Structure

- `src/index.css` — brand design tokens (`@theme`). Hex values were sampled from
  the official brand proposal (`brand/Kiwi Retail Solutions - Brand Proposal.pdf`,
  pages 5 & 8) — don't tweak them by eye.
- `src/assets/brand/` — official logo/asset PNGs from the designer's kit
  (source of truth: `1. PNG-20260903T064402Z-1-001/`).
- `src/assets/media/` — real product screenshots (dark mode, captured from the
  live CMS, Wilson Works Trading Inc. tenant).
- `public/media/` — screen recordings of the real app (mp4 + posters), used by
  the "watch it work" section.
- `src/sections/` — one file per page section, composed in `src/App.tsx`.

## Fonts

The brand kit specifies Grand Royal (display), Telegraf (headers) and Lato
(body). Grand Royal and Telegraf aren't freely licensable for web embedding, so
the site uses **Fraunces** and **Instrument Sans** as stand-ins (via Fontsource,
self-hosted). Swap them in `src/index.css` + `src/main.tsx` if licenses are
acquired.

## Pricing

The pricing section mirrors the backend plan catalog
(`kiwi-signage-backend/src/modules/plan/domain/plan-catalog.ts`) — the same
source the in-app Compare Plans page reads. Keep them in sync when plans change.

Known deliberate deviation: the Pro card omits "PDFs" (the catalog's marketing
row mentions them, but the Pro plan's upload types and widget flags exclude PDF).

## To do before launch

- Replace `contact@kiwisolutions.com` with the real contact address (the
  "kiwisolutions.com" domain predates the Kiwi Technologies naming).
- Set an absolute URL for the `og:image` meta tag once the domain is known.
