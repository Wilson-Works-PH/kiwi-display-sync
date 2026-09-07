import indoorDisplay from "../../assets/devices/indoor-display.webp";
import floorStanding from "../../assets/devices/floor-standing.webp";
import outdoor from "../../assets/devices/outdoor.webp";
import ePoster from "../../assets/devices/e-poster.webp";
import tabletop from "../../assets/devices/tabletop.webp";
import type { Quad } from "./homography";

/**
 * Real Kiwi hardware from kiwi.com.ph/digital-solutions — the product renders
 * (transparent PNGs, trimmed and re-encoded as webp) with the screen panel's
 * rectangle measured from each render, in percent of the trimmed image. The
 * demo composites live content into that rectangle, so a simulated screen is
 * the actual device a customer would buy. Front-facing renders use the
 * rectangle; renders shot at an angle (the E-Poster on its easel, the outdoor
 * totem) also carry the screen's four CORNERS, and `DisplayFrame` projects the
 * content onto them with a real perspective transform (see homography.ts).
 * Corners were measured by masking the saturated wallpaper pixels in each
 * render (`sat > 28`) and taking the extreme points — re-run that if a render
 * is ever re-trimmed. Rotatable, K-type kiosk and the tabletop stay out of the
 * demo wall (tabletop is in the map for non-demo use).
 */
export type DeviceId =
  "indoor-display" | "floor-standing" | "outdoor" | "e-poster" | "tabletop";

export interface DeviceSpec {
  /** Catalog product name, as printed on kiwi.com.ph. */
  name: string;
  src: string;
  /** Trimmed render dimensions — drives the frame's aspect ratio. */
  w: number;
  h: number;
  /** Screen panel rectangle (bounding box), percent of the trimmed render. */
  screen: { left: number; top: number; width: number; height: number };
  /**
   * Screen corners (TL, TR, BR, BL) in percent, for renders shot at an angle.
   * When present the frame projects content onto this quad instead of `screen`.
   */
  quad?: Quad;
  /**
   * The panel's width/height ratio used to lay content out flat before projecting.
   * The quad's own edge lengths are foreshortened by the camera angle and would give
   * a squashed box (the E-Poster came out ~0.26, so content sat in black bars).
   * Outdoor totem: 1080×1920 (spec). E-Poster: the 1488×3840 artwork the user made
   * for it — switch to 9/16 if the real panel turns out to be 1080×1920.
   */
  screenAspect?: number;
}

export const DEVICES: Record<DeviceId, DeviceSpec> = {
  "indoor-display": {
    name: "Indoor Digital Display",
    src: indoorDisplay,
    w: 1389,
    h: 793,
    screen: { left: 1.11, top: 1.95, width: 97.67, height: 96.3 },
  },
  "floor-standing": {
    name: "Indoor Floor-standing Large Format Display",
    src: floorStanding,
    w: 479,
    h: 1445,
    screen: { left: 7.31, top: 2.7, width: 84.13, height: 49.76 },
  },
  outdoor: {
    name: "Outdoor Floor-standing Large Format Display",
    src: outdoor,
    w: 421,
    h: 938,
    screen: { left: 25.18, top: 5.76, width: 62.47, height: 62.37 },
    quad: [
      [25.25, 5.33],
      [87.62, 7.56],
      [87.13, 67.44],
      [25.25, 68.33],
    ],
    screenAspect: 9 / 16,
  },
  "e-poster": {
    name: "Indoor Digital E-Poster",
    src: ePoster,
    w: 461,
    h: 973,
    screen: { left: 10.63, top: 1.95, width: 71.37, height: 95.17 },
    quad: [
      [35.21, 3.56],
      [85.68, 1.33],
      [55.16, 98.0],
      [2.35, 94.22],
    ],
    screenAspect: 1488 / 3840,
  },
  tabletop: {
    name: "Digital Tabletop Display",
    src: tabletop,
    w: 895,
    h: 1385,
    screen: { left: 16.54, top: 6.35, width: 67.37, height: 84.33 },
  },
};

/**
 * Grow the overlay a hair past the measured panel so no wallpaper peeks out at the
 * edges. A hair only: the Indoor Digital Display's bezel is ~1 % of its width, and
 * 0.5 % per side swallowed it (user, 2026-09-07: "this eats the frame").
 */
export const SCREEN_BLEED_PCT = 0.12;
/** Same idea for projected quads: scale about the centroid. */
export const QUAD_BLEED = 1.012;

/**
 * Width for a render fitted into a cell `height` px tall: portrait units fill
 * the height, landscape units are capped at the cell's width. Use it wherever
 * mixed orientations share a row — never size a row of devices by a common
 * height (a landscape unit as tall as a totem is wider than a phone).
 */
export function fitWidth(dev: DeviceSpec, height: number): string {
  return `min(100%, ${Math.round((height * dev.w) / dev.h)}px)`;
}
