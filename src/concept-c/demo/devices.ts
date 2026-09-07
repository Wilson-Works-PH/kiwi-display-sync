import indoorDisplay from "../../assets/devices/indoor-display.webp";
import floorStanding from "../../assets/devices/floor-standing.webp";
import outdoor from "../../assets/devices/outdoor.webp";
import ePoster from "../../assets/devices/e-poster.webp";
import tabletop from "../../assets/devices/tabletop.webp";

/**
 * Real Kiwi hardware from kiwi.com.ph/digital-solutions — the product renders
 * (transparent PNGs, trimmed and re-encoded as webp) with the screen panel's
 * rectangle measured from each render, in percent of the trimmed image. The
 * demo composites live content into that rectangle, so a simulated screen is
 * the actual device a customer would buy. Only front-facing renders sit in
 * the demo wall; the angled ones (rotatable, K-type kiosk, and the tabletop,
 * which is shot at ~10°) would need a perspective transform to overlay on —
 * `tabletop` stays in the map for non-demo use.
 */
export type DeviceId = "indoor-display" | "floor-standing" | "outdoor" | "e-poster" | "tabletop";

export interface DeviceSpec {
  /** Catalog product name, as printed on kiwi.com.ph. */
  name: string;
  src: string;
  /** Trimmed render dimensions — drives the frame's aspect ratio. */
  w: number;
  h: number;
  /** Screen panel rectangle, percent of the trimmed render. */
  screen: { left: number; top: number; width: number; height: number };
}

export const DEVICES: Record<DeviceId, DeviceSpec> = {
  "indoor-display": { name: "Indoor Digital Display", src: indoorDisplay, w: 1389, h: 793, screen: { left: 0.65, top: 1.77, width: 98.34, height: 96.72 } },
  "floor-standing": { name: "Indoor Floor-standing Display", src: floorStanding, w: 479, h: 1445, screen: { left: 7.31, top: 2.7, width: 84.13, height: 49.76 } },
  outdoor: { name: "Outdoor Floor-standing Display", src: outdoor, w: 421, h: 938, screen: { left: 25.18, top: 5.76, width: 62.47, height: 62.37 } },
  "e-poster": { name: "Digital E-Poster", src: ePoster, w: 461, h: 973, screen: { left: 10.63, top: 1.95, width: 71.37, height: 95.17 } },
  tabletop: { name: "Digital Tabletop Display", src: tabletop, w: 895, h: 1385, screen: { left: 16.54, top: 6.35, width: 67.37, height: 84.33 } },
};

/** Grow the overlay a hair past the measured panel so no wallpaper peeks out at the edges. */
export const SCREEN_BLEED_PCT = 0.5;
