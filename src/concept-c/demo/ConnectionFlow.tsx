import type { CSSProperties } from "react";
import { cx } from "../cx";

/**
 * Dashboard → Kiwi cloud → screens. Dashed lines always drift; while a push
 * is in flight they speed up and lime packets travel the paths. Rendered
 * 96×320 so the CSS `offset-path` coordinates match the SVG 1:1.
 */
const W = 96;
const H = 320;
const OUTS = [72, 160, 248];
const IN_PATH = `M 0 160 L 40 160`;
const OUT_PATHS = OUTS.map((y) => `M 56 160 C 72 160, 76 ${y}, ${W} ${y}`);

export function ConnectionFlow({ busy, pulseKey }: { busy: boolean; pulseKey: number }) {
  return (
    <>
      {/* Desktop: vertical strip between the two halves. */}
      <div className="relative hidden h-[320px] w-[96px] shrink-0 self-center lg:block" aria-hidden="true">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible">
          <path d={IN_PATH} fill="none" stroke="#7fa060" strokeWidth="1.5" className={cx("c-flow-line", busy && "is-busy")} />
          {OUT_PATHS.map((d) => (
            <path key={d} d={d} fill="none" stroke="#7fa060" strokeWidth="1.5" className={cx("c-flow-line", busy && "is-busy")} />
          ))}
          {OUTS.map((y) => (
            <circle key={y} cx={W} cy={y} r="3" fill="#7fa060" />
          ))}
          <circle cx="0" cy="160" r="3" fill="#7fa060" />
        </svg>
        <div className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-plum-950 shadow-[0_8px_20px_-8px_rgba(45,13,41,0.5)] ring-1 ring-plum-950/10">
          <span className="c-icon is-filled" style={{ fontSize: 20 }}>cloud</span>
        </div>
        {busy
          ? OUT_PATHS.map((d, i) => (
              <span
                key={`${pulseKey}-${i}`}
                className="c-packet absolute left-0 top-0 size-2 rounded-full bg-lime-400 shadow-[0_0_8px_#ceed7a]"
                style={{ offsetPath: `path('${IN_PATH.replace("L 40 160", "L 48 160")} ${d.replace("M 56 160", "L 56 160")}')`, animationDelay: `${i * 90}ms` } as CSSProperties}
              />
            ))
          : null}
      </div>

      {/* Stacked layouts: a compact horizontal hint. */}
      <div className="flex items-center justify-center gap-3 py-2 text-[12px] font-semibold text-plum-950/60 lg:hidden" aria-hidden="true">
        <span>Dashboard</span>
        <span className={cx("h-px w-10 border-t border-dashed border-leaf-600", busy && "border-lime-400")} />
        <span className="grid size-8 place-items-center rounded-full bg-white text-plum-950 shadow ring-1 ring-plum-950/10">
          <span className="c-icon is-filled" style={{ fontSize: 18 }}>cloud</span>
        </span>
        <span className={cx("h-px w-10 border-t border-dashed border-leaf-600", busy && "border-lime-400")} />
        <span>Screens</span>
      </div>
    </>
  );
}
