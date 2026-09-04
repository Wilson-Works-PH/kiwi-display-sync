const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

/*
 * Plan limits mirror the backend plan catalog (see CLAUDE.md) — the design's
 * placeholder numbers were replaced with the real ones.
 */

function Check({ color = "#71864F" }: { color?: string }) {
  return (
    <span className="msr text-[18px]" style={{ color }}>
      check
    </span>
  );
}

export function BPricing() {
  return (
    <section
      id="pricing"
      className="relative bg-[#F1EDE1]"
      style={{ padding: "150px clamp(20px,5vw,48px) 160px" }}
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto mb-[70px] max-w-[680px] text-center">
          <div data-b-reveal className="mb-5 text-[11px] font-bold tracking-[0.16em] text-[#9D3A6A] uppercase">
            Pricing
          </div>
          <h2
            data-b-reveal
            data-delay="80"
            className="mt-0 mb-[18px] font-semibold"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(40px,5vw,72px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Priced per screen.
            <br />
            <em className="font-medium text-[#9D3A6A]">Nothing per seat.</em>
          </h2>
          <p data-b-reveal data-delay="160" className="m-0 text-[17px] leading-[1.55] text-[#5A4A5E]">
            Seats are included with every plan — pay only for the displays
            that are actually on the wall.
          </p>
        </div>

        <div className="grid items-stretch gap-[18px] lg:grid-cols-3">
          {/* Basic */}
          <div
            data-b-reveal
            data-b-price
            className="relative flex flex-col rounded-[26px] border border-[#2C1830]/8 bg-white px-8 py-9 will-change-transform"
          >
            <div className="text-[13px] font-bold tracking-[0.1em] text-[#6B5B70] uppercase">Basic</div>
            <div className="mt-4 mb-1.5 flex items-baseline gap-1.5">
              <span className="font-semibold" style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em" }}>
                Free
              </span>
            </div>
            <div className="mb-7 text-sm text-[#5A4A5E]">with the display</div>
            <div className="flex flex-1 flex-col gap-3 text-[14.5px]">
              <div className="flex gap-2.5"><Check />Up to 5 displays</div>
              <div className="flex gap-2.5"><Check />1 user account</div>
              <div className="flex gap-2.5"><Check />100 MB media storage</div>
              <div className="flex gap-2.5"><Check />Text, image and video widgets</div>
              <div className="flex gap-2.5"><Check />Layouts, 10 schedules, 10 campaigns</div>
            </div>
            <a
              data-b-magnet
              href={DEMO}
              className="mt-[30px] flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-[#2C1830]/20 text-[15px] font-semibold text-[#2C1830] will-change-transform hover:border-[#2C1830] hover:bg-[#F7F5F9]"
              style={{ transition: "border-color .25s, background .25s" }}
            >
              Start free
            </a>
          </div>

          {/* Pro */}
          <div
            data-b-reveal
            data-delay="100"
            data-b-price
            className="relative flex flex-col overflow-hidden rounded-[26px] bg-[#2C1830] px-8 py-9 text-[#F7EFF3] shadow-[0_50px_100px_-40px_rgba(44,24,48,0.7)] will-change-transform"
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[26px]">
              <div
                className="absolute -top-[70px] -right-[70px] size-[240px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(183,210,79,0.32), transparent 68%)" }}
              />
            </div>
            <div className="relative z-[1] flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.1em] text-[#B7D24F] uppercase">Pro</span>
              <span className="rounded-full bg-[#B7D24F] px-2.5 py-[5px] text-[11px] font-bold tracking-[0.08em] text-[#2C1830] uppercase">
                Most popular
              </span>
            </div>
            <div className="relative z-[1] mt-4 mb-1.5 flex items-baseline gap-1.5">
              <span className="font-semibold" style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em" }}>
                ₱99
              </span>
              <span className="text-[15px] text-[#F7EFF3]/70">/ device / mo</span>
            </div>
            <div className="relative z-[1] mb-7 text-sm text-[#F7EFF3]/70">
              billed monthly · 1 month free on annual
            </div>
            <div className="relative z-[1] flex flex-1 flex-col gap-3 text-[14.5px]">
              <div className="flex gap-2.5"><Check color="#B7D24F" />Up to 10 displays</div>
              <div className="flex gap-2.5"><Check color="#B7D24F" />Up to 5 role-based seats</div>
              <div className="flex gap-2.5"><Check color="#B7D24F" />10 GB media storage</div>
              <div className="flex gap-2.5"><Check color="#B7D24F" />GIFs, live websites, clocks &amp; QR widgets</div>
              <div className="flex gap-2.5"><Check color="#B7D24F" />Advanced scheduling — recurring &amp; dayparting</div>
              <div className="flex gap-2.5"><Check color="#B7D24F" />Full analytics dashboard · 90-day activity logs</div>
            </div>
            <a
              data-b-magnet
              href={DEMO}
              className="relative z-[1] mt-[30px] flex h-[50px] items-center justify-center gap-2 rounded-full bg-[#B7D24F] text-[15px] font-bold text-[#2C1830] will-change-transform hover:bg-[#DCEB9C]"
              style={{ transition: "background .25s" }}
            >
              Start with Pro
              <span className="msr text-[18px]">arrow_forward</span>
            </a>
          </div>

          {/* Enterprise */}
          <div
            data-b-reveal
            data-delay="200"
            data-b-price
            className="relative flex flex-col rounded-[26px] border border-[#2C1830]/8 bg-white px-8 py-9 will-change-transform"
          >
            <div className="text-[13px] font-bold tracking-[0.1em] text-[#6B5B70] uppercase">Enterprise</div>
            <div className="mt-4 mb-1.5 flex items-baseline gap-1.5">
              <span className="mt-2.5 self-start text-sm text-[#5A4A5E]">from</span>
              <span className="font-semibold" style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em" }}>
                ₱129
              </span>
              <span className="text-[15px] text-[#5A4A5E]">/ device / mo</span>
            </div>
            <div className="mb-7 text-sm text-[#5A4A5E]">annual · 2 months free · volume pricing</div>
            <div className="flex flex-1 flex-col gap-3 text-[14.5px]">
              <div className="flex gap-2.5"><Check />Everything in Pro</div>
              <div className="flex gap-2.5"><Check />Unlimited displays &amp; seats, plus SSO</div>
              <div className="flex gap-2.5"><Check />Storage from 50 GB, scalable</div>
              <div className="flex gap-2.5"><Check />PDF widgets and uploads</div>
              <div className="flex gap-2.5"><Check />Scheduling automation · custom reporting</div>
              <div className="flex gap-2.5"><Check />Full audit trail · dedicated manager + SLA</div>
            </div>
            <a
              data-b-magnet
              href="mailto:contact@wilsonworksph.com"
              className="mt-[30px] flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-[#2C1830]/20 text-[15px] font-semibold text-[#2C1830] will-change-transform hover:border-[#2C1830] hover:bg-[#F7F5F9]"
              style={{ transition: "border-color .25s, background .25s" }}
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
