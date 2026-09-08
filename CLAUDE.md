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
  2026-09-08 on the local stack**, each ONE capability / ONE action / ONE result
  (brief of 2026-09-08; judged at a 390 px viewport first): hero = Storefront 01
  → Content → Change layout now → Kiwi Food → Now playing, header thumbnail and
  the Overview screenshot switch (the "screen" is the simulated player's
  screenshot, swapped through the real player API — NOT a physical display);
  displays = the fleet list → location selector → "Makati" → that location's
  two screens; schedule = the week scoped to one screen group → arm "Kiwi Food" →
  drag a window on Thursday → the block sits among the day's blocks (the naming
  drawer is cut); designer = template picker → Fullscreen Media → Create →
  select the empty section → Add image → the 16:9 library file → canvas fills →
  full-frame preview (3:2 frame; naming/resolution off camera). Framing rules
  live in `scripts/cut-clip.py`'s callers: whole page ≈1.4 s first, ONE push-in,
  the result element whole, one benefit caption (bar on phones, pill from `sm`).
  Files: `public/media/<clip>-light.mp4` (desktop) + `<clip>-light-m.mp4`
  (phone encode of the same cut) + posters; raw takes in gitignored
  gitignored `recordings/` (NOT under `public/` — Vite copies `public/` into `dist/`, so takes kept
  there shipped 29 MB with every build until 2026-09-08) with a JSON sidecar. Re-record with
  `scripts/record-cms.mjs --clip <name> --sim-tokens <file>` and cut with
  `scripts/cut-clip.py` (see "Recording the CMS on LOCAL"). The interactive
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
privacy policy the app stores link to (`src/concept-c/PrivacyPage.tsx`, effective 2026-09-08). Since
2026-09-08 it is a MERGE of the CMS team's revised draft (legal scaffolding: DPO, lawful bases,
retention periods, deletion procedure, breach notice, rights, NPC registration) with this site's
verified data inventory; the team's in-app deletion path was dropped because no such feature exists.
Items the team must confirm are listed in the file's header comment. Its factual
claims were checked against the backend (player register/heartbeat/screenshot payloads, account
fields, audit log, AWS S3 + SES, MongoDB Atlas, MQTT); update the page whenever the apps collect
something new. The product name is **Kiwi Display Sync** (user, 2026-09-08; the CMS is live at cms.kiwi.com.ph) — the policy calls the Android app "the Kiwi Display Sync app for Android" and the CMS "the Kiwi Display Sync web app".

## Page structure and copy rules (2026-09-08 brief, approved section by section)

Order: nav → hero → client proof (`CTrust`) → "Upload → Create → Assign → Publish" (`CHowItWorks`) →
the three recordings (`CShowcase`) → `CFeatures` ("Beyond the basics": ONLY what the recordings don't
show — campaigns/playlists, fonts + folders, remote actions, teams/roles, plus the two physical-screen
visuals on phones) → `CUseCases` (Solutions) → `CPricing` → `CFaq` ("Before you buy") → `CFinalCta` →
footer → `CStickyCta`. The plum "Why teams switch" band was removed (user). Each section must add
something the previous ones didn't — don't reintroduce the library grid / schedule still / benefit
tiles that repeated the recordings.

- **Hero:** category label "Digital signage software" visible at every width; description "Manage,
  schedule, and publish content to digital signs across all your locations."; phones lead with "See
  Kiwi in action", desktop with "Book a demo".
- **Trust:** "Trusted by organisations running Kiwi displays" (they are display customers; don't claim
  they use the CMS). Logos carry a per-mark `scale` for comparable weight; never one height for all.
  Fact chip: "Runs on any Android display" (user, 2026-09-08).
- **Solutions:** descriptive titles, never invented customers. Retail = real 1920×1080 product
  catalogue on the indoor display; restaurant = real 1080×1920 menu on the floor-standing unit;
  corporate = drawn "Welcome" on the e-poster; government = drawn permit requirements on the outdoor
  totem, with a note that those two are illustrative. NEVER use the `tabletop` render (no screen quad,
  user dislikes it). Swap in real office/public-service layouts if the user provides them.
- **Typography (proposal p.10):** Fraunces = Grand Royal stand-in for h1/h2 only; Lato for h3/h4,
  body and all UI. Grand Royal/Telegraf aren't web-licensed — say "stand-in", never "brand match".
  Instrument Sans is gone from the dependency list.
- **CTAs:** the phone floating bar shows only after the recordings have scrolled off and hides over
  pricing, the FAQ, the final panel and the footer. Final panel = one "Book a demo" and "See how your
  content looks on screen in a 20-minute demo." (the 20-minute format is unverified — carried copy).
- **FAQ:** answers are verified against the product (per-workspace plan limits, device-cap behaviour,
  prefetch + offline status, URL-only website widget, any-Android hardware). Unverified, so NOT on the
  page: VAT, onboarding contents, offline playback duration.
- **Decorative brand art never over text:** content wrappers are `relative`; give slices their own
  room on phones.
- **Review baseline:** 390 px real emulation first (`page-tour.mjs`/`site-check.mjs` in the session
  notes), then 820 and 1440. If a font package is added/removed while the user's `vite --host` dev
  server (:5174) runs, its resolver cache breaks (500 on main.tsx) until they restart it — verify on
  a separate `vite preview` port instead and never kill :5174.

## Icons

`public/favicon.png` (64), `favicon-32.png` and `apple-touch-icon.png` are the brand kit's round kiwi
slice (`Kiwi_FruitSlice_Purple.png`), not the "k" mark the user dislikes; tab/og title is
"Kiwi Display Sync — Every screen. One platform." Regenerate from the kit, don't hand-draw.

## Client logos

`KIWI_CLIENT_LOGO/` (gitignored source, user-supplied 2026-09-08) → `src/assets/clients/*.webp`:
backgrounds keyed out (white, a baked-in checkerboard, black, pink), dark-on-light everywhere, 120px
tall. `CTrust` shows them grayscale/70 % with colour on hover: a marquee on phones, a wrapped row on
desktop. Re-run the keying script (in the session notes) if new logos arrive; don't hand-edit.

## Recording the CMS on LOCAL (2026-09-07/08, user decision: "record on local so we have full control")

Production can't be used (the APK fleet is production-only), so the clips are recorded against the
dev stack: backend on :3000 (Atlas `kiwi-cms-dev-local`), and a **production build of the CMS
frontend served by `vite preview` on :4173** (`npm run build && npx vite preview --port 4173` in
`../kiwi-signage-frontend`) — the :5173 dev server shows TanStack devtools badges and is the user's;
never kill it. Cookies: export `context.storageState()` from the logged-in MCP browser RIGHT BEFORE
recording into `.secrets/cms-storage-state.json` (gitignored; better-auth rotates the session token).

**Recorder** — `scripts/record-cms.mjs --clip hero|displays|schedule|designer --sim-tokens <file>`:
headless system Chrome launched with `--force-device-scale-factor=2` (the only way the screencast is a
real 2×; the context's deviceScaleFactor alone pads 1× frames), viewport 1280×800 → raw 2560×1600 WebM.
Every flow runs QUIETLY first (warm-up: primes queries + images, then undoes its mutations), the app is
reloaded, the take runs with a drawn-in cursor whose glides are animated IN-PAGE (`window.__kwGlide`,
one rAF loop — 28 Playwright mouse moves over a blurred dialog backdrop took 6–8 s). The quiet pass
clicks by coordinates (locator.click refuses targets under an overlay). Feature clips run with the
sidebar collapsed (`kiwi:sidebar-collapsed`), the hero keeps it. Toast layer hidden for hero, schedule
and designer (no MQTT broker locally → change-layout reports `delivered:false` and the CMS toasts
"Queued — display offline"; the other toasts landed under frame edges). The sidecar
`recordings/<clip>.json` carries `startSec` and named `marks` — they run ≈0.35 s LATER than the
video, so place cuts from frame strips, never from marks. Park the pointer on empty space before the
take (a hover tooltip over a block showed in an opening).

**Cutter** — `python3 scripts/cut-clip.py RAW OUT --start S --dur D --out-size WxH --window t[-t2]:x,y,w
[--cut a:b]… [--fade 0.25] [--poster 0.93]`: keyframed crop windows in CSS px of the capture (height
follows the output aspect; a range = smoothstep move, a single time = hard step), `--cut` removes raw
ranges (jump cuts over loading/typing/idle), fades at both ends mark the loop restart. zoompan crops at
the source aspect, so other aspects zoom by the binding dimension and crop per frame (never stretch).
Encode each clip twice: desktop (1600 or 1500 wide) and phone (800–900 wide), same windows.
`scripts/encode-clip.sh` is the older plain trim/encode (still works for a straight cut).

**Simulated players** on the real /player API (recipe in the frontend memory): "Storefront 01"
(SIM-PORTRAIT-0001, 1080x1920), "Counter Display" (SIM-LANDSCAPE-0001), "Window Display"
(SIM-LANDSCAPE-0002); re-register with the same hardwareKey to get tokens (claim code from
/admin/tenant/me), heartbeat every ≤90 s to stay Online (a keeper script in the session scratchpad),
`POST /player/screenshot` with a layout preview to set what the CMS shows as the screen. Groups in the
dev tenant "Kiwi Digital": "Makati storefront" / "Makati window" / "BGC counter" (one screen each, by
orientation) + "Makati" (Storefront 01 + Window Display, the displays clip's location). Hour-block
schedules Mon–Wed (free plan: 10 active schedules, no dayparts). The revoked test device "Standing
office" still exists (not ours to delete) and shows in the displays clip's whole-page opening.
Layout previews for the features section: `src/assets/media/layouts/*.webp` (re-download from the API
if layouts change) on devices whose panel RESOLUTION matches (1080×1920 on totems, 1920×1080 on the
Indoor Digital Display), letterboxed never cropped. Device screen rects come from a percentile scan of
the wallpaper pixels; projected devices (E-Poster, outdoor totem) lay content out at `screenAspect`.

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
