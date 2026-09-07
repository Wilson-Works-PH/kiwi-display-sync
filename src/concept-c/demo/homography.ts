/**
 * Map a flat rectangle onto an arbitrary convex quadrilateral with a CSS
 * `matrix3d()` — the way to composite live content onto a device render that
 * was photographed at an angle (the E-Poster leans back on its easel stand,
 * the outdoor totem is a three-quarter view).
 *
 * The maths is the standard 4-point homography: eight unknowns from the four
 * corner correspondences, solved by Gaussian elimination, then written into
 * the 4×4 column-major form CSS expects (z row/column identity, perspective
 * terms in the fourth row).
 */

export type Pt = readonly [x: number, y: number];
/** Corners in reading order: top-left, top-right, bottom-right, bottom-left. */
export type Quad = readonly [Pt, Pt, Pt, Pt];

/** Homography H (row-major 3×3) with H·(src_i) ~ dst_i for the four corners. */
export function solveHomography(src: Quad, dst: Quad): number[] {
  const rows: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  const h = gaussianEliminate(rows);
  return [...h, 1];
}

/** Solve an 8×8 system given as augmented rows [a0..a7 | b]. */
function gaussianEliminate(m: number[][]): number[] {
  const n = 8;
  const a = m.map((r) => [...r]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++)
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    if (pivot !== col) [a[col], a[pivot]] = [a[pivot], a[col]];
    const p = a[col][col];
    if (Math.abs(p) < 1e-12) continue; // degenerate quad — leave the row, result will be off but finite
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = a[r][col] / p;
      if (f === 0) continue;
      for (let c = col; c <= n; c++) a[r][c] -= f * a[col][c];
    }
  }
  return a.map((r, i) => (Math.abs(r[i]) < 1e-12 ? 0 : r[n] / r[i]));
}

/**
 * CSS transform that sends the box (0,0)–(w,h) onto `dst` (same px space,
 * transform-origin must be `0 0`).
 */
export function matrix3dFor(w: number, h: number, dst: Quad): string {
  const H = solveHomography(
    [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ],
    dst,
  );
  const [a, b, c, d, e, f, g, i, j] = H;
  const n = (v: number) => (Math.abs(v) < 1e-9 ? 0 : +v.toPrecision(9));
  return `matrix3d(${n(a)}, ${n(d)}, 0, ${n(g)}, ${n(b)}, ${n(e)}, 0, ${n(i)}, 0, 0, 1, 0, ${n(c)}, ${n(f)}, 0, ${n(j)})`;
}

const dist = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]);

/**
 * A sensible flat size for the content box before it is projected: the mean
 * of the opposite edge lengths, so text is laid out for roughly the on-screen
 * width and neither squashed nor stretched by the projection.
 */
export function flatSizeOf(q: Quad): { w: number; h: number } {
  return {
    w: (dist(q[0], q[1]) + dist(q[3], q[2])) / 2,
    h: (dist(q[0], q[3]) + dist(q[1], q[2])) / 2,
  };
}

/** Grow a quad about its centroid (1.01 = 1 % bigger) — the bleed that hides hairline gaps at the bezel. */
export function inflateQuad(q: Quad, factor: number): Quad {
  const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
  const cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  return q.map(
    ([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor] as const,
  ) as unknown as Quad;
}

/** Percent-of-image quad → px in a box of the given size. */
export function scaleQuad(q: Quad, w: number, h: number): Quad {
  return q.map(
    ([x, y]) => [(x / 100) * w, (y / 100) * h] as const,
  ) as unknown as Quad;
}
