import { BKiwi } from "./BKiwi";

const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

export function BCta() {
  return (
    <section
      className="relative overflow-hidden bg-[#B7D24F] text-[#2C1830]"
      style={{ padding: "150px clamp(20px,5vw,48px) 270px" }}
    >
      <BKiwi
        seeds={8}
        flesh="#DCEB9C"
        dataAttr="data-b-kiwi2"
        className="absolute left-[-18vw] opacity-90 will-change-transform"
        style={
          {
            "--k": "min(62vw,900px)",
            width: "var(--k)",
            height: "var(--k)",
            bottom: "calc(var(--k) * -0.7)",
          } as React.CSSProperties
        }
      />
      <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-x-16 gap-y-11">
        <h2
          data-b-reveal
          className="relative z-[1] m-0 min-w-0 flex-[1_1_620px] font-semibold"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(44px,6vw,100px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          the future is
          <br />
          <em className="font-medium whitespace-nowrap">Kiwi Display Sync.</em>
        </h2>
        <div
          data-b-reveal
          data-delay="150"
          className="relative z-[1] flex max-w-[340px] flex-[0_1_340px] flex-col items-start gap-5 pb-2"
        >
          <p className="m-0 max-w-[380px] text-lg leading-[1.5] font-medium">
            Say goodbye to long lines and stale screens. Pair your first display
            in under a minute.
          </p>
          <a
            data-b-magnet
            href={DEMO}
            className="inline-flex h-[58px] items-center gap-2.5 rounded-full bg-[#2C1830] px-7 text-base font-semibold text-white will-change-transform hover:!bg-[#9D3A6A]"
            style={{ transition: "background .25s" }}
          >
            Get started free
            <span className="msr text-[20px]">arrow_outward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
