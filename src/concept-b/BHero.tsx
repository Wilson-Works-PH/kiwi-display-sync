import { BKiwi } from "./BKiwi";

const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

const STATS = [
  { count: 1284, suffix: "", label: "Screens live" },
  { count: 96, suffix: "%", label: "Online right now" },
  { count: 7, suffix: "", label: "Widget types" },
  { count: 60, suffix: "+", label: "Audited actions" },
];

export function BHero() {
  return (
    <section
      data-b-hero
      className="relative grid min-h-screen items-center overflow-hidden"
      style={{ padding: "180px clamp(20px,5vw,48px) 120px" }}
    >
      <BKiwi
        seeds={12}
        withGuides
        dataAttr="data-b-kiwi"
        className="absolute top-[8vh] right-[-14vw] z-0 will-change-transform"
        style={{
          width: "min(62vw,900px)",
          height: "min(62vw,900px)",
          filter: "drop-shadow(0 40px 80px rgba(44,24,48,0.18))",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1180px]">
        <div
          data-b-reveal
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#2C1830]/8 bg-white/70 py-2 pr-3.5 pl-2.5 backdrop-blur-sm"
        >
          <span
            className="size-2 rounded-full bg-[#8FAE2E] shadow-[0_0_0_4px_rgba(143,174,46,0.2)]"
            style={{ animation: "bblink 2.2s ease-in-out infinite" }}
          />
          <span className="text-[11px] font-bold tracking-[0.16em] text-[#9D3A6A] uppercase">
            Kiwi Display Sync · digital signage CMS
          </span>
        </div>

        <h1
          className="m-0 max-w-[14ch] font-semibold text-[#2C1830]"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(56px,8.6vw,132px)",
            lineHeight: 0.94,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-b-word className="inline-block will-change-transform">Every</span>{" "}
            <span data-b-word className="inline-block will-change-transform">screen,</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-b-word className="inline-block font-medium text-[#9D3A6A] italic will-change-transform">on</span>{" "}
            <span data-b-word className="inline-block font-medium text-[#9D3A6A] italic will-change-transform">message.</span>
          </span>
        </h1>

        <p
          data-b-reveal
          data-delay="500"
          className="mt-[34px] max-w-[560px] font-medium text-[#5A4A5E]"
          style={{ fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5 }}
        >
          Kiwi Display Sync runs the screens in your shops, lobbies and canteens
          from one calm console — design layouts on a real canvas, schedule by
          daypart, and see what's on air before anyone calls.
        </p>

        <div data-b-reveal data-delay="650" className="mt-10 flex flex-wrap items-center gap-3.5">
          <a
            data-b-magnet
            href={DEMO}
            className="inline-flex h-[58px] items-center gap-2.5 rounded-full bg-[#2C1830] px-7 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(44,24,48,0.6)] transition-colors duration-250 will-change-transform hover:!bg-[#9D3A6A]"
          >
            Open the live demo
            <span className="msr text-[20px]">arrow_outward</span>
          </a>
          <a
            data-b-magnet
            href="#product"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("product");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
            }}
            className="inline-flex h-[58px] items-center gap-2.5 rounded-full border-[1.5px] border-[#2C1830]/22 px-6 text-base font-semibold text-[#2C1830] transition-colors duration-250 will-change-transform hover:border-[#2C1830] hover:bg-white/50"
          >
            <span className="msr text-[20px]">play_circle</span>
            See it work
          </a>
        </div>

        <div data-b-reveal data-delay="820" className="mt-[84px] flex flex-wrap gap-11">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="font-semibold"
                style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em" }}
              >
                <span data-count={s.count}>0</span>
                {s.suffix}
              </div>
              <div className="mt-2 text-xs font-bold tracking-[0.12em] text-[#6B5B70] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-9 z-[2] flex items-center gap-3 text-[11px] font-bold tracking-[0.16em] text-[#6B5B70] uppercase"
        style={{ left: "clamp(20px,5vw,48px)" }}
      >
        <span
          className="inline-block h-11 w-px bg-gradient-to-b from-[#6B5B70] to-transparent"
          style={{ animation: "bfloat 2.4s ease-in-out infinite" }}
        />
        Scroll
      </div>
    </section>
  );
}
