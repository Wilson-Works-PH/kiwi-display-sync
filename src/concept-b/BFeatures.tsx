import designerShot from "../assets/media/designer-light.webp";
import scheduleShot from "../assets/media/schedule-light.webp";
import dashboardDark from "../assets/media/dashboard-dark.webp";

const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

function Kicker({ icon, children }: { icon: string; children: string }) {
  return (
    <div
      data-b-reveal
      className="mb-[22px] inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#9D3A6A] uppercase"
    >
      <span className="msr text-[18px]">{icon}</span>
      {children}
    </div>
  );
}

function RowTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      data-b-reveal
      data-delay="80"
      className="mt-0 mb-[22px] font-semibold"
      style={{
        fontFamily: SERIF,
        fontSize: "clamp(36px,4vw,60px)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
      }}
    >
      {children}
    </h3>
  );
}

function Shot({
  src,
  alt,
  dark = false,
  circle,
}: {
  src: string;
  alt: string;
  dark?: boolean;
  circle: { className: string; color: string; parallax: string };
}) {
  return (
    <div
      data-b-reveal
      data-delay="120"
      data-b-tilt
      className="relative will-change-transform"
    >
      <div
        data-b-parallax={circle.parallax}
        className={`absolute z-0 rounded-full ${circle.className}`}
        style={{ background: circle.color }}
      />
      <div
        className="relative z-[1] overflow-hidden rounded-[22px]"
        style={{
          boxShadow: `0 50px 100px -30px rgba(44,24,48,${dark ? "0.5" : "0.4"}), 0 0 0 1px rgba(44,24,48,0.08)`,
          background: dark ? "#1a111c" : "#fff",
        }}
      >
        <img
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

const CARDS = [
  {
    icon: "layers",
    iconBg: "#F4E2EC",
    iconColor: "#9D3A6A",
    title: "Display groups",
    body: "Schedule to a group, not a screen. Sync a video wall frame-for-frame and re-sync after a restart.",
  },
  {
    icon: "photo_library",
    iconBg: "#EEF3D7",
    iconColor: "#56693A",
    title: "Media library",
    body: "Images, video and PDFs in folders with a quota you can see. Drop into any section from the designer.",
  },
  {
    icon: "widgets",
    iconBg: "#E9EDDB",
    iconColor: "#56693A",
    title: "Seven widgets",
    body: "Text, image, video, website, clock, QR and PDF — each with its own settings, transitions and live preview.",
  },
  {
    icon: "admin_panel_settings",
    iconBg: "#F4E2EC",
    iconColor: "#9D3A6A",
    title: "Access control",
    body: "Grant view, edit and delete to user groups on folders. Permissions cascade; inherited grants are labelled.",
  },
  {
    icon: "history",
    iconBg: "#EEF3D7",
    iconColor: "#56693A",
    title: "Audit log",
    body: "Every mutation, append-only. Who changed what, and when — 90 days on Pro, forever on Enterprise.",
  },
  {
    icon: "verified_user",
    iconBg: "#E9EDDB",
    iconColor: "#56693A",
    title: "Two-factor, built in",
    body: "Authenticator apps and backup codes for every account. Sessions you can see and revoke.",
  },
];

export function BFeatures() {
  return (
    <section
      id="features"
      className="relative bg-[#F1EDE1]"
      style={{ padding: "150px clamp(20px,5vw,48px) 60px" }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Layouts row */}
        <div className="mb-[110px] grid items-center gap-14 lg:mb-[170px] lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Kicker icon="view_quilt">Layouts</Kicker>
            <RowTitle>
              Design on a real canvas, at the real resolution.
            </RowTitle>
            <p
              data-b-reveal
              data-delay="160"
              className="mt-0 mb-[30px] text-[17px] leading-[1.6] text-[#5A4A5E]"
            >
              Divide the screen into sections, drop in text, video, a live web
              page or a ticking clock, and watch it render exactly as the player
              will. Auto-saved. One editor at a time. Publish when it's right.
            </p>
            <div data-b-reveal data-delay="240" className="flex flex-col gap-3">
              {[
                "Snap, align, rotate and layer sections",
                "Per-section playlists with transitions",
                "Draft → Published → Retired, enforced",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 text-[15px] font-semibold"
                >
                  <span className="msr grid size-[26px] place-items-center rounded-full bg-[#EEF3D7] text-base text-[#56693A]">
                    check
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <Shot
            src={designerShot}
            alt="Layout designer"
            circle={{
              className: "-top-[30px] -right-[30px] size-[180px] blur-[2px]",
              color: "#B7D24F",
              parallax: "-0.08",
            }}
          />
        </div>

        {/* Schedules row */}
        <div className="mb-[110px] grid items-center gap-14 lg:mb-[170px] lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <Shot
              src={scheduleShot}
              alt="Schedule"
              circle={{
                className: "-bottom-10 -left-10 size-[220px] opacity-90",
                color: "#9D3A6A",
                parallax: "0.1",
              }}
            />
          </div>
          <div className="order-1 lg:order-2">
            <Kicker icon="calendar_month">Schedules &amp; dayparts</Kicker>
            <RowTitle>Lunch rush is a rule, not a spreadsheet.</RowTitle>
            <p
              data-b-reveal
              data-delay="160"
              className="mt-0 mb-[30px] text-[17px] leading-[1.6] text-[#5A4A5E]"
            >
              Define a daypart once — Business Hours, Late Night, Weekends — and
              attach it to any schedule. Arm a campaign, drag it onto the week,
              set a priority. Overnight windows wrap, holidays get exceptions,
              and every screen plays in its own timezone.
            </p>
            <div
              data-b-reveal
              data-delay="240"
              className="flex flex-wrap gap-2.5"
            >
              {[
                "Day · Week · Month",
                "Priority & override",
                "Exception dates",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#2C1830]/10 bg-white px-3.5 py-2 text-[13px] font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet health row */}
        <div className="mb-[100px] grid items-center gap-14 lg:mb-[150px] lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Kicker icon="monitor_heart">Fleet health</Kicker>
            <RowTitle>Know what's on air before someone calls.</RowTitle>
            <p
              data-b-reveal
              data-delay="160"
              className="mt-0 mb-[30px] text-[17px] leading-[1.6] text-[#5A4A5E]"
            >
              Online versus offline, who's holding current content, faults by
              severity, the last crash on every player — and a screenshot when
              you need proof. Pair a new screen with a six-character code.
              Reboot, resync or clear cache from your desk.
            </p>
            <a
              data-b-magnet
              href={DEMO}
              className="inline-flex items-center gap-2 text-[15px] font-bold text-[#9D3A6A] will-change-transform hover:text-[#2C1830]"
            >
              Explore the dashboard
              <span className="msr text-[18px]">arrow_forward</span>
            </a>
          </div>
          <Shot
            src={dashboardDark}
            alt="Dashboard in dark mode"
            dark
            circle={{
              className: "top-[40%] -right-[50px] size-[160px]",
              color: "#71864F",
              parallax: "-0.12",
            }}
          />
        </div>

        {/* capability cards */}
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <div
              key={c.title}
              data-b-reveal
              data-delay={String(i * 90)}
              className="rounded-[22px] border border-[#2C1830]/8 bg-white p-[30px] transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(44,24,48,0.35)]"
              style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
            >
              <span
                className="msr grid size-11 place-items-center rounded-xl text-[22px]"
                style={{ background: c.iconBg, color: c.iconColor }}
              >
                {c.icon}
              </span>
              <div className="mt-5 mb-2 text-[19px] font-bold tracking-[-0.01em]">
                {c.title}
              </div>
              <div className="text-[14.5px] leading-[1.55] text-[#5A4A5E]">
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
