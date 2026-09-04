const SERIF = "'Newsreader Variable', Georgia, serif";
const DEMO = "https://kiwi.wilsonworksph.com";

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-[18px] text-xs font-bold tracking-[0.14em] text-[#B7D24F] uppercase">
        {title}
      </div>
      <div className="flex flex-col gap-3 text-[14.5px]">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="text-[#F7EFF3]/80 hover:text-white">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function BFooter() {
  return (
    <footer
      data-b-dark
      className="relative overflow-hidden bg-[#2C1830] text-[#F7EFF3]"
      style={{ padding: "90px clamp(20px,5vw,48px) 40px" }}
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 border-b border-white/10 pb-[70px] sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex flex-col items-start text-[#E084AF]">
              <span className="text-[34px] leading-[0.9] font-bold tracking-[-0.02em]" style={{ fontFamily: SERIF }}>
                kiwi
              </span>
              <span className="mt-1.5 text-[11px] leading-none font-bold tracking-[0.22em] uppercase opacity-85">
                display sync
              </span>
            </div>
            <p className="mt-6 max-w-[320px] text-[14.5px] leading-[1.6] text-[#F7EFF3]/65">
              Kiwi Display Sync by Kiwi Technologies · enhancing efficiency,
              elevating experiences.
            </p>
          </div>
          <Col
            title="Product"
            links={[
              { label: "Overview", href: "#product" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Live demo", href: DEMO },
            ]}
          />
          <Col
            title="Platform"
            links={[
              { label: "Android player", href: DEMO },
              { label: "Global fonts", href: DEMO },
              { label: "Resolutions", href: DEMO },
              { label: "Platform console", href: DEMO },
            ]}
          />
          <Col
            title="Contact"
            links={[{ label: "contact@wilsonworksph.com", href: "mailto:contact@wilsonworksph.com" }]}
          />
        </div>
        <div className="mt-[30px] flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[#F7EFF3]/50">
          <span>© 2026 Kiwi Technologies</span>
          <span>Made with plum, lime and a little bit of berry.</span>
        </div>
      </div>
    </footer>
  );
}
