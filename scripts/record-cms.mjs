#!/usr/bin/env node
/**
 * Record one clip of the REAL Kiwi CMS for the marketing site.
 *
 *   node scripts/record-cms.mjs --clip hero --sim-tokens /path/sim-tokens.json
 *
 * Clips — one story each (user, 2026-09-08: "give each feature recording one obvious story…
 * remove navigation that does not help explain the feature"):
 *   hero      Storefront 01 → Content → "Change layout now" → pick Kiwi Food → the Now playing
 *             card, the header thumbnail and the Overview screenshot all switch. Ends on the result.
 *   displays  Fleet list → location selector → "Makati" → only that location's screens remain.
 *   schedule  Week scoped to one screen group → arm "Kiwi Food" → drag a window on Thursday → (name +
 *             Enter, cut in post) → the block sits on the week among the day's other blocks.
 *   designer  Template picker (already open) → Fullscreen Media → Create → click the empty section →
 *             Add image from the library → the canvas fills → Preview.
 *
 * How it works: headless system Chrome (playwright-core) at 1280×800 CSS px captured at 2× (2560×1600)
 * so the encode downscales instead of upscaling, logged in with a Playwright storageState exported
 * from the MCP browser, a DRAWN-IN cursor (Playwright videos have no pointer) that glides between
 * targets and ripples on click, and Playwright's recordVideo. Feature clips run with the CMS sidebar
 * collapsed to its icon rail (localStorage `kiwi:sidebar-collapsed`); the hero keeps the full sidebar
 * as the establishing shot. Output: recordings/<clip>.webm + a JSON sidecar with the on-camera
 * start second and named `marks` (seconds) for caption timing — encode with scripts/encode-clip.sh.
 *
 * Every flow runs QUIETLY once first (warm-up: primes queries + images so nothing loads on camera,
 * then undoes its own mutations), the app is reloaded, and the take is recorded.
 *
 * The "screen" of the simulated player: the hero uploads the chosen layout's preview to
 * POST /player/screenshot with the sim's bearer token during the opening hold; the CMS only refetches
 * the screenshot URL when the override click invalidates the display queries, so the new content
 * appears exactly when the override lands (the local backend has no MQTT broker, so a real push can't
 * reach a real device here — see CLAUDE.md "Recording the CMS on LOCAL").
 */
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "true"]);
    return acc;
  }, []),
);
const CLIP = args.clip ?? "hero";
// Local dev by default (user decision 2026-09-07: record on local for full control — simulated
// online displays, our own content, no production data in frame). Pass --base for another host.
const BASE = args.base ?? "http://localhost:4173"; // vite preview of the CMS build: no devtools badges, no HMR
// NOT under public/: Vite copies public/ into dist/, so takes placed there ship with the build.
const OUT_DIR = resolve(args.out ?? "recordings");
const WORKSPACE = args.workspace ?? "Kiwi Digital";
const DISPLAY = args.display ?? "Storefront 01";
const LAYOUT = args.layout ?? ""; // hero: layout to switch to (default "Kiwi Food"); designer: name for the new layout
const BEFORE_LAYOUT = args["before-layout"] ?? "Kiwi Restaurant"; // hero: what the screen shows before the switch
const HERO_LAYOUT = LAYOUT || "Kiwi Food";
const SCHEDULE_LAYOUT = args["schedule-layout"] ?? "Kiwi Food";
const SCHEDULE_GROUP = args.group ?? "Makati storefront"; // portrait group for a portrait layout (orientation rule)
const LOCATION_GROUP = args["location-group"] ?? "Makati"; // displays clip: a location group with two screens
const SCHEDULE_NAME = args["schedule-name"] ?? "Lunch promo";
const SCHEDULE_FROM_HOUR = Number(args["from-hour"] ?? 11), SCHEDULE_TO_HOUR = Number(args["to-hour"] ?? 15);
const MEDIA = args.media ?? "Still---Video-Wall"; // 16:9 image for the 16:9 section — anything else gets cropped by the layout (user, 2026-09-07)
const API = args.api ?? "http://localhost:3000/api/v1";
// Player tokens for the simulated displays ({ "<display name>": { token } }) — only the hero needs them.
const SIM_TOKENS = args["sim-tokens"] ? JSON.parse(readFileSync(args["sim-tokens"], "utf8")) : {};
const RAIL = args.rail ?? (CLIP === "hero" ? "expanded" : "collapsed");
const W = 1280, H = 800, SCALE = 2;
let createdLayoutId = null;
let createdScheduleId = null;
// Playwright storageState (or a bare cookie array) exported from the logged-in MCP browser RIGHT BEFORE
// recording — better-auth rotates the session token, so a file from an hour ago lands on the login page.
const COOKIES = args.cookies ?? ".secrets/cms-storage-state.json";
mkdirSync(OUT_DIR, { recursive: true });

// `--force-device-scale-factor=2` is what makes the 2× capture real: with only the context's
// deviceScaleFactor, Chrome's screencast still hands Playwright 1280×800 frames and the recorder pads
// them into the 2560×1600 canvas (verified 2026-09-08). The browser-level flag renders at 2× for real.
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: [`--force-device-scale-factor=${SCALE}`] });
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: SCALE,
  colorScheme: "light",
  recordVideo: { dir: OUT_DIR, size: { width: W * SCALE, height: H * SCALE } },
});
const cookieFile = JSON.parse(readFileSync(COOKIES, "utf8"));
await context.addCookies(Array.isArray(cookieFile) ? cookieFile : cookieFile.cookies);
// Force the CMS light theme, the rail state and a visible cursor before any page script runs.
await context.addInitScript(({ rail, hideToasts }) => {
  try {
    localStorage.setItem("kiwi:theme", "light");
    localStorage.setItem("kiwi:sidebar-collapsed", rail === "collapsed" ? "true" : "false");
  } catch { /* private mode */ }
  const style = document.createElement("style");
  style.textContent = `
    #kw-cursor{position:fixed;left:0;top:0;width:22px;height:22px;pointer-events:none;z-index:2147483647;
      transform:translate(-3px,-3px);transition:transform .08s linear}
    #kw-cursor svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
    #kw-ripple{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;
      background:rgba(206,237,122,.55);pointer-events:none;z-index:2147483646;opacity:0;transform:scale(.3)}
    #kw-ripple.on{animation:kw-rip .45s ease-out}
    @keyframes kw-rip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.2)}}
    [class*="tsqd-"],[class*="TanStackRouterDevtools"],[id*="TanStackRouterDevtools"],.tsrd-open-btn,button[aria-label*="TanStack"]{display:none!important}
    ${hideToasts ? `div.fixed.bottom-6.left-0.right-0[class*="z-[70]"]{display:none!important}` : ""}`;
  const mount = () => {
    document.head.appendChild(style);
    const c = document.createElement("div"); c.id = "kw-cursor";
    c.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 3l14 8-6 1.5L9.5 19 5 3z" fill="#fff" stroke="#2d0d29" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const r = document.createElement("div"); r.id = "kw-ripple";
    document.body.append(c, r);
    window.addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; });
    window.addEventListener("mousedown", () => { r.classList.remove("on"); void r.offsetWidth; r.classList.add("on"); });
    // Glide the DRAWN cursor in-page (one requestAnimationFrame loop) instead of 28 Playwright
    // mouse.move round-trips: over a blurred dialog backdrop at 2× each round-trip stalled behind
    // screencast frames and a 0.6 s glide stretched to 6–8 s on camera (2026-09-08).
    window.__kwGlide = (x, y, ms) => new Promise((done) => {
      const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(c.style.transform);
      const fx = m ? +m[1] + 3 : x, fy = m ? +m[2] + 3 : y;
      const t0 = performance.now();
      const stepFrame = (now) => {
        const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3);
        const cx = fx + (x - fx) * e, cy = fy + (y - fy) * e;
        c.style.transform = `translate(${cx - 3}px,${cy - 3}px)`; r.style.left = cx + "px"; r.style.top = cy + "px";
        if (t < 1) requestAnimationFrame(stepFrame); else done();
      };
      requestAnimationFrame(stepFrame);
    });
  };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
  // The local backend has no MQTT broker, so change-layout reports `delivered:false` and the CMS
  // toasts "Queued — display offline" although the sim is online. The hero hides the toast layer
  // rather than show copy that contradicts the Online chip; the state changes themselves are real.
}, { rail: RAIL, hideToasts: CLIP === "hero" || CLIP === "schedule" || CLIP === "designer" }); // schedule: the "Schedule created" toast sits under the cut's working window and would show half-cut

const page = await context.newPage();
const T0 = Date.now();
const now = () => (Date.now() - T0) / 1000;
const pause = (ms) => page.waitForTimeout(ms);
/** Warm-up pass: same steps, no cursor theatre, no pauses — primes every query and image so the on-camera take shows no loading. */
let quiet = false;
let startSec = 0;
const marks = {};
/** Name a beat for caption timing (seconds since recording start; encode-clip.sh subtracts the start). */
const mark = (name) => { if (!quiet) { marks[name] = now(); console.log(`  mark ${name} @ ${marks[name].toFixed(1)}s`); } };
/** Call once the pre-roll navigation has settled: everything before this is trimmed by the encoder. */
async function onCamera() {
  if (quiet || startSec) return;
  await settled();
  await pause(600);
  startSec = now();
  console.log(`on-camera from ${startSec.toFixed(1)}s`);
}
/** Hold a beat on camera only. */
const hold = (ms) => pause(quiet ? 0 : ms);

/** Glide the cursor to a locator (eased, ~600ms) and click it. */
async function glideClick(locator, { settle = 500 } = {}) {
  await locator.first().waitFor({ state: "visible" });
  await locator.first().scrollIntoViewIfNeeded();
  const b = await locator.first().boundingBox();
  if (quiet) {
    // Coordinate click, like the take: locator.click() refuses targets whose hit test lands on an
    // overlay (the canvas section's overlay sits over its placeholder hint).
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    await pause(Math.min(settle, 250));
    return;
  }
  await glideTo({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
  await pause(180);
  await page.mouse.down(); await pause(90); await page.mouse.up();
  await pause(settle);
}
let cursor = { x: 640, y: 400 };
/** Eased ~650 ms glide of the drawn cursor (animated in-page), then the real pointer follows in one move. */
async function glideTo(to, ms = 650) {
  await page.evaluate(([x, y, d]) => window.__kwGlide ? window.__kwGlide(x, y, d) : undefined, [to.x, to.y, ms]);
  await page.mouse.move(to.x, to.y);
  cursor = to;
}

let booted = false;
/**
 * Go to a CMS page the way a person does: boot the app once at "/", then click
 * the sidebar link. Deep links don't survive the app's boot redirect (it lands
 * on /dashboard), and a real click reads better on video anyway.
 */
async function open(path) {
  if (!booted) {
    await page.goto(BASE + "/", { waitUntil: "load" });
    if (page.url().includes("select-workspace")) {
      await glideClick(page.getByText(WORKSPACE, { exact: false }));
      await page.waitForURL((u) => !u.pathname.includes("select-workspace"));
    }
    await settled();
    await page.mouse.move(cursor.x, cursor.y);
    booted = true;
  }
  if (new URL(page.url()).pathname !== path) {
    await glideClick(page.locator(`nav a[href="${path}"], aside a[href="${path}"], a[href="${path}"]`).first(), { settle: 300 });
    await page.waitForURL((u) => u.pathname === path, { timeout: 8000 }).catch(() => undefined);
  }
  await settled();
  await pause(quiet ? 150 : 900);
}
/**
 * Data, not skeletons. The CMS Skeleton is a plain `bg-*` block with `animate-pulse` /
 * `data-slot="skeleton"`; also wait for the network to go quiet, then a beat for images to paint.
 */
async function settled() {
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => undefined);
  await page.waitForFunction(() => !document.querySelector('.animate-pulse, [data-slot="skeleton"], [data-skeleton], [aria-busy="true"], [class*="skeleton"]'), null, { timeout: 8000 }).catch(() => undefined);
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => undefined);
  await pause(quiet ? 100 : 500);
}

const dialog = () => page.locator(".fixed.inset-0").last();
const inMain = (text) => page.locator("main").getByText(text, { exact: true }).first();
/** Every <img> inside `scope` decoded — closing a dialog before its thumbnails finished loading leaves them uncached. */
async function imagesLoaded(scope = "body") {
  await page.waitForFunction((sel) => {
    const root = [...document.querySelectorAll(sel)].pop();
    return !!root && [...root.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0);
  }, scope, { timeout: 8000 }).catch(() => undefined);
}

/* ------------------------------------------------------------------ admin API (via the page's session) */
const adminGet = (path) => page.evaluate(async ([api, p]) => (await fetch(api + p, { credentials: "include" })).json(), [API, path]);
const adminSend = (method, path, body) => page.evaluate(async ([api, p, m, b]) => {
  const r = await fetch(api + p, { method: m, credentials: "include", headers: b ? { "Content-Type": "application/json" } : {}, body: b ? JSON.stringify(b) : undefined });
  return { status: r.status, body: await r.text().catch(() => "") };
}, [API, path, method, body ?? null]);
async function findDisplay(name) { return (await adminGet("/admin/displays?limit=50")).data.find((d) => d.name === name) ?? null; }
async function findLayout(name) { return (await adminGet("/admin/layouts?limit=100")).data.find((l) => l.name === name) ?? null; }

/**
 * The sim's "screen": upload a layout's preview as the player screenshot. Node's fetch talks to the
 * player API directly with the sim's bearer token (no cookies involved).
 */
async function uploadSimScreenshot(displayName, layoutName) {
  const tok = SIM_TOKENS[displayName]?.token;
  if (!tok) { console.warn(`  no sim token for "${displayName}" — screenshot not swapped`); return; }
  const layout = await findLayout(layoutName);
  if (!layout?.previewUrl) { console.warn(`  layout "${layoutName}" has no preview`); return; }
  const bytes = await page.evaluate(async (u) => Array.from(new Uint8Array(await (await fetch(u)).arrayBuffer())), layout.previewUrl);
  const form = new FormData();
  form.append("file", new Blob([Uint8Array.from(bytes)], { type: "image/jpeg" }), "screen.jpg");
  const r = await fetch(`${API}/player/screenshot`, { method: "POST", headers: { Authorization: `Bearer ${tok}` }, body: form });
  console.log(`  sim "${displayName}" screenshot ← ${layoutName} (${r.status})`);
}

/**
 * Hero "before" state: the screen plays BEFORE_LAYOUT and its screenshot shows it. Set as a manual
 * override rather than "revert to schedule": the schedule is time-of-day dependent (the 11:00 Lunch
 * block already plays Kiwi Food, so an 11:05 take had no visible change — 2026-09-08), an override is
 * deterministic. `final` reverts to the schedule so nothing is left behind.
 */
async function resetHeroState({ final = false } = {}) {
  const d = await findDisplay(DISPLAY);
  if (!d) return;
  if (final) {
    const r = await adminSend("POST", `/admin/displays/${d.id}/actions/revert-to-schedule`);
    console.log(`  hero: reverted to schedule (${r.status})`);
  } else {
    const before = await findLayout(BEFORE_LAYOUT);
    const r = await adminSend("POST", `/admin/displays/${d.id}/actions/change-layout`, { layoutId: before.id });
    console.log(`  hero: playing ${BEFORE_LAYOUT} (${r.status})`);
  }
  await uploadSimScreenshot(DISPLAY, BEFORE_LAYOUT);
}

/** The designer flow creates a real layout; remove it again (the recording is the artefact, not the layout). */
async function discardCreatedLayout() {
  if (!createdLayoutId) return;
  const id = createdLayoutId; createdLayoutId = null;
  const r = await adminSend("DELETE", `/admin/layouts/${id}`);
  console.log(`  discarded layout ${id} (${r.status})`);
}
/** Same for the schedule the schedule flow books. */
async function discardCreatedSchedule() {
  const list = (await adminGet("/admin/schedules?limit=200")).data ?? [];
  for (const s of list.filter((s) => s.name === SCHEDULE_NAME || s.name === "Warm-up window")) {
    const r = await adminSend("DELETE", `/admin/schedules/${s.id}`);
    console.log(`  discarded schedule "${s.name}" ${s.id} (${r.status})`);
  }
  createdScheduleId = null;
}

/* ------------------------------------------------------------------ schedule grid geometry */
/** Screen point for (day column, hour) on the week grid: the header cell gives x, the scroll box gives y. */
async function gridPoint(dayOfMonth, hour) {
  return page.evaluate(([dom, h]) => {
    // Header cell = <div>Thu</div><div>10</div> stacked in a flex column (the caps are CSS): its text
    // collapses to "Thu10" — match case-insensitively.
    const heads = [...document.querySelectorAll("main div")].filter((el) => /^(mon|tue|wed|thu|fri|sat|sun)$/i.test(el.textContent?.trim() ?? ""));
    let x = null;
    for (const head of heads) {
      const cell = head.parentElement;
      const text = cell?.textContent?.replace(/\s+/g, "") ?? "";
      if (new RegExp(`^(mon|tue|wed|thu|fri|sat|sun)${dom}$`, "i").test(text)) { const r = cell.getBoundingClientRect(); x = r.left + r.width / 2; break; }
    }
    const scroll = [...document.querySelectorAll("main div")].find((el) => getComputedStyle(el).overflowY === "auto" && el.scrollHeight > el.clientHeight + 100 && el.querySelector("[style*='height']"));
    if (x == null || !scroll) return null;
    const hourPx = (scroll.firstElementChild?.getBoundingClientRect().height ?? 768) / 24;
    const r = scroll.getBoundingClientRect();
    return { x, y: r.top + h * hourPx - scroll.scrollTop, hourPx };
  }, [dayOfMonth, hour]);
}

const FLOWS = {
  // Hero: one screen, one switch. Storefront 01 (Overview: what plays now) → Content → Change layout now →
  // Kiwi Food → Now playing + header thumbnail switch → Overview shows the new screen. Ends on the result.
  hero: async () => {
    await open("/displays");
    await glideClick(inMain(DISPLAY), { settle: 1200 });
    if (!quiet && !startSec) {
      // Off camera: visit the Content tab and open/close the picker once so their queries sit in the
      // in-memory cache (the reload before the take emptied it) and no skeleton flashes on camera.
      await page.getByRole("button", { name: "Content", exact: true }).click();
      await page.getByRole("button", { name: "Change layout now" }).click();
      await dialog().getByText(HERO_LAYOUT, { exact: true }).waitFor({ state: "visible" });
      await imagesLoaded(".fixed.inset-0");
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Overview", exact: true }).click();
      await pause(400);
    }
    await onCamera();
    // The player's "next screenshot" shows the new layout. Uploaded during the opening hold: the CMS
    // keeps showing the old image until the override click invalidates the screenshot URL, so the
    // swap lands exactly when the story needs it and the dialog beat has no waiting in it.
    await uploadSimScreenshot(DISPLAY, HERO_LAYOUT);
    await hold(1400);
    mark("content");
    await glideClick(page.getByRole("button", { name: "Content", exact: true }), { settle: 900 });
    mark("picker");
    await glideClick(page.getByRole("button", { name: "Change layout now" }), { settle: 300 });
    await dialog().getByText(HERO_LAYOUT, { exact: true }).waitFor({ state: "visible" });
    if (quiet) await imagesLoaded(".fixed.inset-0");
    await hold(350);
    await glideClick(dialog().getByText(HERO_LAYOUT, { exact: true }), { settle: 300 });
    mark("clicked");
    await page.locator("main").getByText("Manual override").first().waitFor({ state: "visible", timeout: 15000 });
    mark("switched");
    await hold(1800);
    mark("result");
    await glideClick(page.getByRole("button", { name: "Overview", exact: true }), { settle: 600 });
    await hold(5000);
  },
  // Fleet by location: the list with live status → the location selector → "Makati" → only that
  // location's screens remain (their location line reads the group). One capability, one action.
  displays: async () => {
    await open("/displays");
    await onCamera();
    mark("all");
    await hold(1600);
    mark("menu");
    await glideClick(page.getByRole("button", { name: "All groups", exact: true }), { settle: 500 });
    mark("pick");
    await glideClick(page.getByRole("button", { name: LOCATION_GROUP, exact: true }), { settle: 400 });
    await page.locator("main").getByText(LOCATION_GROUP, { exact: true }).first().waitFor({ state: "visible", timeout: 8000 });
    await settled();
    mark("result");
    await hold(3800);
  },
  // Schedule: the week for one screen group (the toolbar filter pre-fills the drawer's target) → arm
  // content in the library → drag a window on Thursday → the drawer opens off to the right, the name is
  // typed and Enter submits (the cut removes that beat, per the brief: no typing on camera) → the block
  // sits on the week among the existing day blocks.
  schedule: async () => {
    await open("/schedule");
    if (!quiet && !startSec) {
      // Off camera: scope the week to one screen group (cleaner grid, and the drawer's target is pre-filled).
      await page.getByRole("button", { name: "All groups", exact: true }).click();
      await page.getByRole("button", { name: SCHEDULE_GROUP, exact: true }).click();
      await settled();
      // Park the pointer on empty library space: left over a block it raises a hover tooltip that would
      // sit in the whole-page opening (seen in the first take).
      await page.mouse.move(190, 660); cursor = { x: 190, y: 660 };
      await pause(400);
    } else if (quiet) {
      await page.getByRole("button", { name: "All groups", exact: true }).click();
      await page.getByRole("button", { name: SCHEDULE_GROUP, exact: true }).click();
      await settled();
    }
    await onCamera();
    await hold(1400);
    mark("arm");
    await glideClick(page.locator("aside, main").getByRole("button", { name: SCHEDULE_LAYOUT }).first(), { settle: 500 });
    mark("drag");
    // Thursday of the visible week — the grid opens on the current (Mon–Sun) week, so record Mon–Thu.
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7; // 0 on Monday
    const thu = new Date(today); thu.setDate(today.getDate() - mondayOffset + 3);
    const from = await gridPoint(thu.getDate(), SCHEDULE_FROM_HOUR);
    const to = await gridPoint(thu.getDate(), SCHEDULE_TO_HOUR);
    if (!from || !to) throw new Error("could not locate the Thursday column on the grid");
    await glideTo({ x: from.x, y: from.y });
    await pause(quiet ? 0 : 250);
    await page.mouse.down();
    const steps = quiet ? 4 : 30;
    for (let i = 1; i <= steps; i++) { await page.mouse.move(from.x, from.y + ((to.y - from.y) * i) / steps); await pause(quiet ? 5 : 26); }
    cursor = { x: to.x, y: to.y };
    await pause(quiet ? 0 : 300);
    mark("dragged"); // last ghost frame — the cut starts here
    await page.mouse.up();
    const form = page.locator('aside[aria-label="New schedule"]');
    await form.waitFor({ state: "visible", timeout: 8000 });
    await page.locator("#schedule-name").waitFor({ state: "visible" });
    // Autofocused; the target is pre-filled from the page's group filter. Enter submits.
    await page.keyboard.type(quiet ? "Warm-up window" : SCHEDULE_NAME, { delay: 0 });
    await page.keyboard.press("Enter");
    await page.locator("main").getByText(quiet ? "Warm-up window" : SCHEDULE_NAME, { exact: false }).first().waitFor({ state: "visible", timeout: 10000 });
    await form.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
    createdScheduleId = true;
    mark("result");
    await hold(3600);
  },
  // Designer: the take opens on the template picker (New layout → name → HD Landscape → Next happen
  // off camera: no naming or resolution steps on camera, per the brief) → Fullscreen Media → Create →
  // [editor loads + one canvas zoom-out step, cut in post] → click the empty section → Add image → the
  // 16:9 library file → the canvas renders it → Preview (the cursor parks in the corner; the cut lands
  // on the full-frame preview). Landscape layout gets landscape media (user rule: sizes must match).
  designer: async () => {
    await open("/layouts");
    await page.getByRole("button", { name: "New layout" }).click();
    const nameBox = page.getByPlaceholder("Lobby morning loop");
    await nameBox.waitFor({ state: "visible" });
    await pause(400); // let the dialog mount its controlled inputs — a fill() during the entrance raced and stayed empty
    const layoutName = quiet ? "Warm-up" : LAYOUT || "Window promo";
    for (let attempt = 0; attempt < 3 && (await nameBox.inputValue()) !== layoutName; attempt++) {
      await nameBox.click();
      await nameBox.fill(layoutName);
      await pause(150);
    }
    await page.getByRole("button", { name: "Select a resolution" }).click();
    await page.getByRole("button", { name: /HD Landscape/ }).click();
    await dialog().getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("radio", { name: /fullscreen media/i }).waitFor({ state: "visible" });
    await imagesLoaded(".fixed.inset-0");
    if (!quiet) { await page.mouse.move(640, 760); cursor = { x: 640, y: 760 }; } // parked under the dialog
    await onCamera();
    await hold(1400);
    mark("template");
    await glideClick(page.getByRole("radio", { name: /fullscreen media/i }), { settle: 500 });
    await glideClick(page.getByRole("button", { name: /create from template/i }), { settle: 150 });
    mark("create"); // cut starts here
    await page.waitForURL((u) => /\/layouts\/[0-9a-f]{24}$/.test(u.pathname), { timeout: 20000 });
    createdLayoutId = new URL(page.url()).pathname.split("/").pop();
    await settled();
    // One zoom step smaller: the canvas then sits centred below the top bar, so it and the whole media
    // picker share one working window with the left toolbar.
    await page.getByRole("button", { name: /zoom out/i }).click();
    await pause(300);
    await page.mouse.move(640, 700); cursor = { x: 640, y: 700 };
    await hold(400);
    mark("editor"); // cut ends here
    await hold(500);
    mark("canvas");
    // The empty section: its placeholder hint (the "MAIN MEDIA" label is uppercased by CSS, so match the hint).
    await glideClick(page.locator("main").getByText(/drop media here/i).first(), { settle: 600 });
    mark("addimage");
    await glideClick(page.getByRole("button", { name: "Add image" }), { settle: 900 });
    const tile = dialog().locator("button").filter({ hasText: MEDIA });
    await tile.waitFor({ state: "attached" });
    if (quiet) await imagesLoaded(".fixed.inset-0");
    if (!quiet) {
      // The 16:9 file sits one row below the fold: a short, visible scroll rather than a jump.
      const grid = dialog().locator(".overflow-y-auto").first();
      const gb = await grid.boundingBox();
      await glideTo({ x: gb.x + gb.width / 2, y: gb.y + gb.height / 2 });
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 30); await pause(50); }
      await pause(350);
    } else {
      await tile.scrollIntoViewIfNeeded();
    }
    mark("pick");
    await glideClick(tile, { settle: 400 });
    // The canvas paints the image once its URL resolves.
    await page.waitForFunction(() => [...document.querySelectorAll("main img")].some((i) => i.complete && i.naturalWidth > 200 && i.getBoundingClientRect().width > 300), null, { timeout: 15000 }).catch(() => undefined);
    mark("filled");
    await hold(1500);
    mark("preview");
    await glideClick(page.getByRole("button", { name: "Preview", exact: true }), { settle: 0 });
    await page.mouse.move(1252, 786); cursor = { x: 1252, y: 786 }; // parked in the preview's corner
    await page.waitForFunction(() => [...document.querySelectorAll("img")].some((i) => i.complete && i.getBoundingClientRect().width > 1000), null, { timeout: 15000 }).catch(() => undefined);
    mark("result");
    await hold(3400);
    await page.keyboard.press("Escape");
    await hold(300);
  },
};

if (!FLOWS[CLIP]) { console.error(`unknown clip "${CLIP}" — one of ${Object.keys(FLOWS).join(", ")}`); process.exit(1); }
try {
  quiet = true;
  await open("/dashboard");
  if (CLIP === "hero") await resetHeroState();
  if (CLIP === "schedule") await discardCreatedSchedule();
  console.log("warm-up pass…");
  await FLOWS[CLIP]();
  await page.keyboard.press("Escape");
  await discardCreatedLayout();
  if (CLIP === "schedule") await discardCreatedSchedule();
  if (CLIP === "hero") await resetHeroState();
  // Fresh in-memory state for the take (the warm-up's mutations must not linger in cached lists);
  // the browser's HTTP cache keeps the warm assets.
  await open("/dashboard");
  await page.reload({ waitUntil: "load" });
  quiet = false;
  await settled();
  await pause(1200);
  await page.mouse.move(cursor.x, cursor.y);
  console.log("take…");
  await FLOWS[CLIP]();
  await discardCreatedLayout();
  if (CLIP === "schedule") await discardCreatedSchedule();
  if (CLIP === "hero") await resetHeroState({ final: true });
} catch (e) {
  console.error(`flow "${CLIP}" failed: ${e.message}`);
  await page.screenshot({ path: resolve(OUT_DIR, `${CLIP}-failed.png`) }).catch(() => undefined);
  // Leave nothing behind even on failure (a warm-up layout once survived a selector timeout).
  await page.keyboard.press("Escape").catch(() => undefined);
  await discardCreatedLayout().catch(() => undefined);
  if (CLIP === "schedule") await discardCreatedSchedule().catch(() => undefined);
  if (CLIP === "hero") await resetHeroState({ final: true }).catch(() => undefined);
} finally {
  const video = page.video();
  await context.close();
  const tmp = await video.path();
  const dest = resolve(OUT_DIR, `${CLIP}.webm`);
  renameSync(tmp, dest);
  writeFileSync(resolve(OUT_DIR, `${CLIP}.json`), JSON.stringify({ clip: CLIP, startSec, marks, viewport: { width: W, height: H, scale: SCALE }, rail: RAIL, recordedAt: new Date().toISOString() }, null, 2));
  console.log(`recorded ${dest} (on-camera from ${startSec.toFixed(1)}s)`);
  await browser.close();
}
