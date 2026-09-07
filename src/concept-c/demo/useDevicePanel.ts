import type { CSSProperties, RefObject } from "react";
import { useElementSize } from "../useElementSize";
import { QUAD_BLEED, SCREEN_BLEED_PCT, type DeviceSpec } from "./devices";
import { flatSizeOf, inflateQuad, matrix3dFor, scaleQuad } from "./homography";

/**
 * Where the live content goes on a device render. Front-facing renders get
 * the measured rectangle (percent, so no measuring needed). Renders shot at
 * an angle carry the screen's four corners; the content is laid out flat at
 * roughly its on-screen size and projected onto them with a perspective
 * transform — which needs the frame's pixel size, hence the ResizeObserver.
 * Hidden until measured so the first paint never shows a flat rectangle.
 */
export function useDevicePanel(
  dev: DeviceSpec,
  frameRef: RefObject<HTMLDivElement | null>,
): CSSProperties {
  const frame = useElementSize(frameRef);
  const b = SCREEN_BLEED_PCT;
  if (!dev.quad) {
    return {
      left: `${dev.screen.left - b}%`,
      top: `${dev.screen.top - b}%`,
      width: `${dev.screen.width + 2 * b}%`,
      height: `${dev.screen.height + 2 * b}%`,
      containerType: "inline-size",
    };
  }
  const px = scaleQuad(
    inflateQuad(dev.quad, QUAD_BLEED),
    frame.width,
    frame.height,
  );
  const measured = flatSizeOf(px);
  // Lay the content out at the panel's ratio (height from the quad's near-vertical
  // edges, which the camera barely foreshortens), not at the projected edge lengths.
  const flat = dev.screenAspect
    ? { h: measured.h, w: measured.h * dev.screenAspect }
    : measured;
  return {
    left: 0,
    top: 0,
    width: flat.w,
    height: flat.h,
    transformOrigin: "0 0",
    transform: matrix3dFor(flat.w, flat.h, px),
    opacity: frame.width > 0 ? 1 : 0,
    backfaceVisibility: "hidden",
    containerType: "inline-size",
  };
}
