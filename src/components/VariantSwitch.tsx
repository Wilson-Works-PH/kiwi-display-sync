import { useLocation, useNavigate } from "react-router-dom";

const CONCEPTS = [
  { path: "/", label: "A", dot: "bg-[#CEED7A]" },
  { path: "/b", label: "B", dot: "bg-[#E084AF]" },
  { path: "/c", label: "C", dot: "bg-[#7FA060]" },
] as const;

/** Floating switcher between the site concepts, for team comparison. */
export function VariantSwitch() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const index = Math.max(0, CONCEPTS.findIndex((c) => (c.path === "/" ? pathname === "/" : pathname.startsWith(c.path))));
  const current = CONCEPTS[index];
  const next = CONCEPTS[(index + 1) % CONCEPTS.length];

  return (
    <button
      type="button"
      onClick={() => navigate(next.path)}
      className="font-header fixed right-4 bottom-4 z-[90] flex items-center gap-2 rounded-full border border-white/20 bg-[#2C1830]/90 px-4 py-2.5 text-xs font-bold tracking-wide text-[#F4F7E4] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur transition-transform hover:-translate-y-0.5"
      aria-label={`Switch to concept ${next.label}`}
    >
      <span className={`size-2 rounded-full ${current.dot}`} aria-hidden="true" />
      Viewing concept {current.label} — switch to {next.label}
    </button>
  );
}
