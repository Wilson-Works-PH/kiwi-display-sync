import { Wordmark } from "../components/Wordmark";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Book a demo", href: "#cta" },
      { label: "contact@wilsonworksph.com", href: "mailto:contact@wilsonworksph.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-cream-100/10 bg-plum-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <span className="text-lime-400">
            <Wordmark className="text-base" color="lime" />
          </span>
          <p className="mt-5 text-sm leading-relaxed text-cream-100/55">
            Digital signage that designs, schedules and syncs itself — so your
            screens always say the right thing.
          </p>
        </div>

        <div className="flex flex-wrap gap-10 sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-header text-xs font-semibold tracking-[0.22em] text-cream-100/40 uppercase">
                {col.title}
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-header text-sm text-cream-100/70 transition-colors hover:text-lime-400"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="font-header mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-cream-100/40 sm:px-8">
          <span>© {new Date().getFullYear()} Kiwi Technologies. All rights reserved.</span>
          <span>Made with 🥝 in the Philippines</span>
        </div>
      </div>
    </footer>
  );
}
