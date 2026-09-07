import { cx } from "../cx";
import type { ScreenStatus } from "./useDemo";

const LABEL: Record<ScreenStatus, string> = {
  synced: "Synced",
  syncing: "Syncing",
  published: "Published",
};

export function StatusChip({
  status,
  size = "sm",
}: {
  status: ScreenStatus;
  size?: "sm" | "xs";
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-px text-[10px]",
        status === "syncing" && "bg-plum-950/[0.06] text-plum-950/70",
        status === "synced" && "bg-leaf-600/15 text-[#4f6b3a]",
        status === "published" && "bg-lime-400 text-plum-950",
      )}
    >
      {status === "syncing" ? (
        <span
          className="c-spin size-2.5 rounded-full border-[1.5px] border-plum-950/25 border-t-plum-950/80"
          aria-hidden="true"
        />
      ) : (
        <span
          className={cx(
            "size-1.5 rounded-full",
            status === "published" ? "bg-plum-950" : "bg-leaf-600",
          )}
          aria-hidden="true"
        />
      )}
      {LABEL[status]}
    </span>
  );
}
