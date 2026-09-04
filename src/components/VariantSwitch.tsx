import { useLocation, useNavigate } from "react-router-dom";

/** Floating switcher between the two site concepts, for team comparison. */
export function VariantSwitch() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onB = pathname.startsWith("/b");

  return (
    <button
      type="button"
      onClick={() => navigate(onB ? "/" : "/b")}
      className="font-header fixed right-4 bottom-4 z-[90] flex items-center gap-2 rounded-full border border-white/20 bg-[#2C1830]/90 px-4 py-2.5 text-xs font-bold tracking-wide text-[#F4F7E4] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur transition-transform hover:-translate-y-0.5"
      aria-label={onB ? "Switch to concept A" : "Switch to concept B"}
    >
      <span
        className={`size-2 rounded-full ${onB ? "bg-[#E084AF]" : "bg-[#CEED7A]"}`}
        aria-hidden="true"
      />
      {onB ? "Viewing concept B — switch to A" : "Viewing concept A — switch to B"}
    </button>
  );
}
