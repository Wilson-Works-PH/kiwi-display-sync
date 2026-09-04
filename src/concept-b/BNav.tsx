import { BKiwi } from "./BKiwi";

const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

function go(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };
}

export function BNav() {
  return (
    <nav
      data-b-nav
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between"
      style={{
        padding: "22px clamp(20px,5vw,48px)",
        transition:
          "padding .35s cubic-bezier(.2,.7,.2,1), background .35s, backdrop-filter .35s, box-shadow .35s",
      }}
    >
      <a href="/b" className="flex items-center gap-3" aria-label="Kiwi Display Sync">
        <BKiwi
          seeds={8}
          className="size-[34px]"
          style={{ animation: "bspin 28s linear infinite" }}
        />
        <span
          data-b-navmark
          className="flex flex-col items-start text-[#9D3A6A] transition-colors duration-300"
        >
          <span
            className="text-[28px] leading-[0.9] font-bold tracking-[-0.02em]"
            style={{ fontFamily: SERIF }}
          >
            kiwi
          </span>
          <span className="mt-[5px] text-[9.5px] leading-none font-bold tracking-[0.22em] uppercase opacity-85">
            display sync
          </span>
        </span>
      </a>
      <div className="flex items-center gap-[34px]">
        <a data-b-navlink href="#product" onClick={go("product")} className="hidden text-sm font-semibold text-[#2C1830] transition-colors duration-300 hover:!text-[#9D3A6A] md:block">
          Product
        </a>
        <a data-b-navlink href="#features" onClick={go("features")} className="hidden text-sm font-semibold text-[#2C1830] transition-colors duration-300 hover:!text-[#9D3A6A] md:block">
          Features
        </a>
        <a data-b-navlink href="#pricing" onClick={go("pricing")} className="hidden text-sm font-semibold text-[#2C1830] transition-colors duration-300 hover:!text-[#9D3A6A] md:block">
          Pricing
        </a>
        <a data-b-navlink href={DEMO} className="hidden text-sm font-semibold text-[#2C1830] transition-colors duration-300 hover:!text-[#9D3A6A] sm:block">
          Sign in
        </a>
        <a
          data-b-navcta
          data-b-magnet
          href={DEMO}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2C1830] px-5 text-sm font-semibold text-white will-change-transform hover:!bg-[#9D3A6A]"
          style={{ transition: "background .25s, color .25s" }}
        >
          Get started
          <span className="msr text-[18px]">arrow_forward</span>
        </a>
      </div>
    </nav>
  );
}
