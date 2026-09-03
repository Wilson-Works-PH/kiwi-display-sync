import type { ReactNode } from "react";

/** Chrome-less browser window used to frame product screenshots. */
export function BrowserFrame({
  children,
  className = "",
  url = "kiwi.wilsonworksph.com",
}: {
  children: ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-frame shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-frame-bar px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-mauve-500" />
          <span className="size-2.5 rounded-full bg-leaf-400" />
          <span className="size-2.5 rounded-full bg-lime-400" />
        </div>
        <div className="font-header flex-1 rounded-full bg-surface-alt px-3 py-1 text-center text-[11px] tracking-wide text-ink/50">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
