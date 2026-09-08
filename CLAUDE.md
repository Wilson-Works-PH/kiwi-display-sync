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
  sync. Since 2026-09-04 (backend PR #133) Pro includes PDF uploads and the PDF widget.
- **Don't touch the backend/CMS repos** from here; read-only for facts.
- **`src/index.css`** holds the brand tokens only (light-only site); Concept C's own styles are in
  `src/concept-c/c.css`.

## The site (Concept C only)

Concepts A and B were removed on 2026-09-08 (user: "remove the concepts and only keep this one");
they live in git history before that date. With them went GSAP/Lenis/Three, the dark/light theme
toggle, the Newsreader/Hanken fonts and Concept A's CMS recordings. `/a`, `/b`, `/c` redirect home.

- `/` — **Concept C** (`src/concept-c/*`): modern light-only SaaS
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
  showroom Jafer Place, 19 Eisenhower St, San Juan City, 1502 Metro Manila (Mon–Fri 9–5), socials @kiwitechnologiesph —
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

Any static deploy needs an SPA fallback (all paths → index.html) for **`/privacy`** — the
privacy policy the app stores link to (`src/concept-c/PrivacyPage.tsx`, effective 2026-09-08). Its
claims were checked against the backend (player register/heartbeat/screenshot payloads, account
fields, audit log, AWS S3 + SES, MongoDB Atlas, MQTT); update the page whenever the apps collect
something new. The product name is **Kiwi Display Sync** (user, 2026-09-08; the CMS is live at cms.kiwi.com.ph) — the policy calls the Android app "the Kiwi Display Sync app for Android" and the CMS "the Kiwi Display Sync web app".

## Client logos

`KIWI_CLIENT_LOGO/` (gitignored source, user-supplied 2026-09-08) → `src/assets/clients/*.webp`:
backgrounds keyed out (white, a baked-in checkerboard, black, pink), dark-on-light everywhere, 120px
tall. `CTrust` shows them grayscale/70 % with colour on hover: a marquee on phones, a wrapped row on
desktop. Re-run the keying script (in the session notes) if new logos arrive; don't hand-edit.

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

## Verification

`npm run build && npm run lint` after every change. Full-page Playwright screenshots show blank
sections below the fold — the `[data-reveal]` IntersectionObserver never fires during a stitched
capture — so verify with stepped viewport screenshots (390 and 1440 at minimum) or
`reducedMotion: 'reduce'` emulation instead.

## Known open items

- Contact channels come from kiwi.com.ph (info@kiwi.com.ph, /contact/).
- `og:image` needs an absolute URL once the production domain exists.
- Grand Royal / Telegraf aren't web-licensed; Fraunces / Instrument Sans are
  the stand-ins. Swap in `src/index.css` + `src/main.tsx` if licensed later.
