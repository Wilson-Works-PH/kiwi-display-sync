import dashboardShot from "../assets/media/dashboard-light.webp";
import designerShot from "../assets/media/designer-light.webp";
import scheduleShot from "../assets/media/schedule-light.webp";

const SERIF = "'Newsreader Variable', Georgia, serif";

const CARDS = [
  { src: dashboardShot, alt: "Kiwi Display Sync dashboard", cap: "Dashboard" },
  { src: designerShot, alt: "Kiwi Display Sync layout designer", cap: "Layout designer" },
  { src: scheduleShot, alt: "Kiwi Display Sync schedule", cap: "Schedule" },
];

export function BStage() {
  return (
    <section
      id="product"
      data-b-stage-section
      data-b-dark
      className="relative overflow-hidden bg-[#2C1830] text-[#F7EFF3]"
      style={{ padding: "140px clamp(20px,5vw,48px) 160px" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(157,58,106,0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 90%, rgba(113,134,79,0.35), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1180px]">
        <div className="mb-20 grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div data-b-reveal className="mb-[22px] text-[11px] font-bold tracking-[0.16em] text-[#B7D24F] uppercase">
              The product
            </div>
            <h2
              data-b-reveal
              data-delay="80"
              className="m-0 font-semibold"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px,5.4vw,80px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              One console.
              <br />
              The whole fleet.
            </h2>
          </div>
          <p
            data-b-reveal
            data-delay="160"
            className="m-0 max-w-[440px] text-lg leading-[1.55] text-[#F7EFF3]/72"
          >
            Dashboard, designer and schedule share one object model — change a
            layout and the timeline, the players and the health card all know
            about it. No syncing, no exports.
          </p>
        </div>

        <div
          data-b-stage
          className="relative"
          style={{
            height: "clamp(420px,54vw,720px)",
            perspective: 1600,
            perspectiveOrigin: "50% 40%",
          }}
        >
          {CARDS.map((c, i) => (
            <div
              key={c.cap}
              data-b-card
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[18px] bg-[#1a111c] will-change-transform"
              style={{
                width: "min(72vw,880px)",
                aspectRatio: "924/540",
                boxShadow: "0 60px 120px -30px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
                transform: "translate(-50%,-50%)",
                zIndex: 2 - Math.abs(i - 1),
              }}
            >
              <div className="flex h-[34px] items-center gap-[7px] border-b border-white/6 bg-[#231a26] px-3.5">
                <span className="size-2.5 rounded-full bg-[#E0616A]" />
                <span className="size-2.5 rounded-full bg-[#E8B85B]" />
                <span className="size-2.5 rounded-full bg-[#7FC56E]" />
                <span className="ml-3.5 h-[18px] flex-1 rounded-md bg-white/6" />
              </div>
              <img
                src={c.src}
                alt={c.alt}
                className="block h-[calc(100%-34px)] w-full object-cover object-top"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-2.5">
          {CARDS.map((c, i) => (
            <span
              key={c.cap}
              data-b-dot
              className="h-1.5 rounded-[3px]"
              style={{
                width: i === 0 ? 28 : 6,
                background: i === 0 ? "#B7D24F" : "rgba(255,255,255,0.25)",
                transition: "background .3s, width .3s",
              }}
            />
          ))}
        </div>
        <div className="mt-[18px] flex flex-wrap justify-center gap-x-12 gap-y-2 text-xs font-bold tracking-[0.14em] uppercase">
          {CARDS.map((c, i) => (
            <span
              key={c.cap}
              data-b-cap
              style={{
                color: i === 0 ? "#B7D24F" : "rgba(255,255,255,0.62)",
                transition: "color .3s",
              }}
            >
              {c.cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
