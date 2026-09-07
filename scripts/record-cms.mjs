#!/usr/bin/env node
/**
 * Record one clip of the REAL Kiwi CMS for the marketing site.
 *
 *   node scripts/record-cms.mjs --clip hero --cookies .secrets/cms-cookies.json [--display "Storefront 01"] [--layout "Weekend sale"]
 *
 * Clips: hero (publish a layout to a display), displays (fleet + groups),
 * schedule (week + dayparts), designer (media library → layout → preview).
 *
 * How it works: headless system Chrome (playwright-core) at 1440×900, logged
 * in with cookies exported from a browser session (never store a password;
 * the account is in two workspaces, so /select-workspace is handled), a
 * DRAWN-IN cursor (Playwright videos have no pointer) that glides between
 * targets and ripples on click, and Playwright's recordVideo. Output lands in
 * public/media/raw/<clip>.webm — trim + encode with scripts/encode-clip.sh.
 *
 * Selectors are the CMS's visible labels (role/text), so they survive
 * re-styling; adjust the flow bodies in the session if the UI moved.
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
const OUT_DIR = resolve(args.out ?? "public/media/raw");
const WORKSPACE = args.workspace ?? "Wilson Works Trading";
const DISPLAY = args.display ?? "Storefront 01";
const LAYOUT = args.layout ?? ""; // hero: layout to assign; designer: name for the new layout
const MEDIA = args.media ?? "Still---Video-Wall"; // 16:9 image for the 16:9 section — anything else gets cropped by the layout (user, 2026-09-07)
const API = args.api ?? "http://localhost:3000/api/v1";
let createdLayoutId = null;
// Playwright storageState (or a bare cookie array) exported from the logged-in MCP browser RIGHT BEFORE
// recording — better-auth rotates the session token, so a file from an hour ago lands on the login page.
const COOKIES = args.cookies ?? ".secrets/cms-storage-state.json";
if (!COOKIES) {
  console.error("--cookies <file> (Playwright cookie JSON exported from a logged-in session; default .secrets/cms-cookies.json)");
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const cookieFile = JSON.parse(readFileSync(COOKIES, "utf8"));
await context.addCookies(Array.isArray(cookieFile) ? cookieFile : cookieFile.cookies);
// Force the CMS light theme + a visible cursor before any page script runs.
await context.addInitScript(() => {
  try { localStorage.setItem("kiwi:theme", "light"); } catch { /* private mode */ }
  const style = document.createElement("style");
  style.textContent = `
    #kw-cursor{position:fixed;left:0;top:0;width:22px;height:22px;pointer-events:none;z-index:2147483647;
      transform:translate(-3px,-3px);transition:transform .08s linear}
    #kw-cursor svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
    #kw-ripple{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;
      background:rgba(206,237,122,.55);pointer-events:none;z-index:2147483646;opacity:0;transform:scale(.3)}
    #kw-ripple.on{animation:kw-rip .45s ease-out}
    @keyframes kw-rip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.2)}}
    [class*="tsqd-"],[class*="TanStackRouterDevtools"],[id*="TanStackRouterDevtools"],.tsrd-open-btn,button[aria-label*="TanStack"]{display:none!important}`;
  const mount = () => {
    document.head.appendChild(style);
    const c = document.createElement("div"); c.id = "kw-cursor";
    c.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 3l14 8-6 1.5L9.5 19 5 3z" fill="#fff" stroke="#2d0d29" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const r = document.createElement("div"); r.id = "kw-ripple";
    document.body.append(c, r);
    window.addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; });
    window.addEventListener("mousedown", () => { r.classList.remove("on"); void r.offsetWidth; r.classList.add("on"); });
  };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
});

const page = await context.newPage();
const T0 = Date.now();
const pause = (ms) => page.waitForTimeout(ms);
/** Warm-up pass: same steps, no cursor theatre, no pauses — primes every query and image so the on-camera take shows no loading. */
let quiet = false;

/** Glide the cursor to a locator (eased, ~600ms) and click it. */
async function glideClick(locator, { settle = 500 } = {}) {
  await locator.first().waitFor({ state: "visible" });
  await locator.first().scrollIntoViewIfNeeded();
  if (quiet) {
    await locator.first().click();
    await pause(Math.min(settle, 250));
    return;
  }
  const b = await locator.first().boundingBox();
  const to = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const steps = 28;
  const from = cursor;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = 1 - Math.pow(1 - t, 3);
    await page.mouse.move(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e);
    await pause(18);
  }
  cursor = to;
  await pause(180);
  await page.mouse.down(); await pause(90); await page.mouse.up();
  await pause(settle);
}
let cursor = { x: 720, y: 450 };

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

/** Hero take starts from "no default layout" so choosing one is a visible change; the warm-up pass had already set it. */
async function resetHeroState() {
  const displayId = await page.evaluate(async ([api, name]) => { const r = await fetch(`${api}/admin/displays?limit=50`, { credentials: "include" }); const j = await r.json(); return j.data.find((d) => d.name === name)?.id ?? null; }, [API, DISPLAY]).catch(() => null);
  if (!displayId) return;
  const status = await page.evaluate(async ([api, id]) => (await fetch(`${api}/admin/displays/${id}/default-layout`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ layoutId: null }) })).status, [API, displayId]).catch(() => "n/a");
  console.log(`hero: default layout cleared (${status})`);
}

/** The designer flow creates a real layout; remove it again (the recording is the artefact, not the layout). */
async function discardCreatedLayout() {
  if (!createdLayoutId) return;
  const id = createdLayoutId; createdLayoutId = null;
  const status = await page.evaluate(async ([api, id]) => (await fetch(`${api}/admin/layouts/${id}`, { method: "DELETE", credentials: "include" })).status, [API, id]).catch(() => "n/a");
  console.log(`discarded layout ${id} (${status})`);
}

const FLOWS = {
  // Hero: Displays → Storefront 01 → Content → "Choose layout" (default / fallback) → pick a layout → the card updates.
  hero: async () => {
    await open("/displays");
    await pause(quiet ? 0 : 1600);
    await glideClick(inMain(DISPLAY), { settle: 1200 });
    await glideClick(page.getByRole("button", { name: "Content", exact: true }), { settle: 900 });
    // Reads "Choose layout" with no default set, "Change layout" once one is — the take starts from none (see resetHeroState).
    await glideClick(page.getByRole("button", { name: /^(Choose layout|Change default|Change layout)$/ }), { settle: 900 });
    await glideClick(dialog().getByText(LAYOUT || "Kiwi Restaurant", { exact: true }), { settle: 2600 });
    await pause(quiet ? 0 : 1600);
  },
  // Fleet: the Displays list with status, then Display Groups.
  displays: async () => {
    await open("/displays");
    await pause(quiet ? 0 : 2200);
    if (!quiet) { await page.mouse.wheel(0, 200); await pause(1200); }
    await open("/displays/groups");
    await pause(quiet ? 0 : 2400);
  },
  // Schedule: the week view, then Dayparts.
  schedule: async () => {
    await open("/schedule");
    await pause(quiet ? 0 : 2600);
    if (!quiet) { await page.mouse.wheel(0, 200); await pause(1000); }
    await open("/dayparts");
    await pause(quiet ? 0 : 2400);
  },
  // Media → Layouts → New layout (HD Landscape, Fullscreen Media) → Add image from the library → Preview.
  // Landscape layout gets landscape media (user rule: resolutions must match the screen).
  designer: async () => {
    await open("/media");
    await pause(quiet ? 0 : 2000);
    await open("/layouts");
    await pause(quiet ? 0 : 1200);
    await glideClick(page.getByRole("button", { name: "New layout" }), { settle: 800 });
    const nameBox = page.getByPlaceholder("Lobby morning loop");
    await glideClick(nameBox, { settle: 200 });
    await nameBox.fill("");
    await page.keyboard.type(quiet ? "Warm-up" : LAYOUT || "Window promo", { delay: quiet ? 0 : 55 });
    await pause(quiet ? 0 : 400);
    await glideClick(page.getByRole("button", { name: "Select a resolution" }), { settle: 500 });
    await glideClick(page.getByRole("button", { name: /HD Landscape/ }), { settle: 500 });
    await glideClick(dialog().getByRole("button", { name: "Next", exact: true }), { settle: 900 });
    await glideClick(page.getByRole("radio", { name: /fullscreen media/i }), { settle: 600 });
    await glideClick(page.getByRole("button", { name: /create from template/i }), { settle: 400 });
    await page.waitForURL((u) => /\/layouts\/[0-9a-f]{24}$/.test(u.pathname), { timeout: 20000 });
    createdLayoutId = new URL(page.url()).pathname.split("/").pop();
    await settled();
    await pause(quiet ? 200 : 1800);
    await glideClick(page.getByRole("button", { name: /^Main Media/ }), { settle: 700 });
    await glideClick(page.getByRole("button", { name: "Add image" }), { settle: 1200 });
    await glideClick(dialog().locator("button").filter({ hasText: MEDIA }), { settle: quiet ? 600 : 2400 });
    await glideClick(page.getByRole("button", { name: "Preview", exact: true }), { settle: quiet ? 500 : 4200 });
    await page.keyboard.press("Escape");
    await pause(quiet ? 0 : 700);
  },
};

if (!FLOWS[CLIP]) { console.error(`unknown clip "${CLIP}" — one of ${Object.keys(FLOWS).join(", ")}`); process.exit(1); }
let startSec = 0;
try {
  quiet = true;
  if (CLIP === "hero") { await open("/dashboard"); await resetHeroState(); }
  await FLOWS[CLIP]();
  await page.keyboard.press("Escape");
  await discardCreatedLayout();
  if (CLIP === "hero") await resetHeroState();
  // Fresh in-memory state for the take (the warm-up's mutations must not linger in cached lists);
  // the browser's HTTP cache keeps the warm assets.
  await open("/dashboard");
  await page.reload({ waitUntil: "load" });
  quiet = false;
  await settled();
  await pause(1200);
  await page.mouse.move(cursor.x, cursor.y);
  await pause(400);
  startSec = (Date.now() - T0) / 1000;
  console.log(`on-camera from ${startSec.toFixed(1)}s (warm-up trimmed by encode-clip.sh)`);
  await FLOWS[CLIP]();
  await discardCreatedLayout();
} catch (e) {
  console.error(`flow "${CLIP}" failed: ${e.message}`);
  await page.screenshot({ path: resolve(OUT_DIR, `${CLIP}-failed.png`) });
} finally {
  const video = page.video();
  await context.close();
  const tmp = await video.path();
  const dest = resolve(OUT_DIR, `${CLIP}.webm`);
  renameSync(tmp, dest);
  writeFileSync(resolve(OUT_DIR, `${CLIP}.json`), JSON.stringify({ clip: CLIP, startSec, recordedAt: new Date().toISOString() }));
  console.log(`recorded ${dest}`);
  await browser.close();
}
