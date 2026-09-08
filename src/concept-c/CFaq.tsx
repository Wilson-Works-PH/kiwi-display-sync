import { Icon, SectionHead } from "./CSections";

/**
 * Essential buying answers, right after pricing (brief, 2026-09-08). Every answer here is
 * verified against the product: plan limits are enforced per workspace (tenant) in the backend's
 * plan gate; the app runs on any Android display (user, 2026-09-08); pairing stops at the device cap with an upgrade notice on the Displays page while
 * paired screens keep running; players prefetch their media from the required-files manifest and
 * report when fully cached, and the CMS marks a screen offline with its last check-in and applies
 * pending changes on its next poll; the website widget (Pro) takes a URL — nothing on the page
 * needs a third-party integration. Not answered because unverified (ask the product owner before
 * adding): VAT, onboarding, and offline playback duration.
 */
const QA: [string, string][] = [
  [
    "Do I need Kiwi displays, or a separate media player?",
    "Neither is required. Kiwi Display Sync runs on any Android display — the app pairs the screen with a claim code, with no separate player box. Kiwi's own displays come with it set up and the Basic plan included.",
  ],
  [
    "Are the limits per account or per screen?",
    "Per account. Devices, users, storage, schedules and campaigns are counted across your whole workspace, not per screen.",
  ],
  [
    "What happens when I reach my plan's device limit?",
    "Pairing a new screen stops until you move to the next plan — the Displays page tells you the plan is full. Screens already paired keep playing.",
  ],
  [
    "What if a screen loses its internet connection?",
    "Screens download their content ahead of time rather than streaming it. The CMS marks a disconnected screen offline with its last check-in, and anything you publish meanwhile is applied when it reconnects.",
  ],
  [
    "Do any features need integrations?",
    "No. Uploading media, building layouts, scheduling and publishing all happen inside Kiwi Display Sync. Live web pages (Pro) simply point at a URL you provide.",
  ],
];

export function CFaq() {
  return (
    <section
      id="faq"
      className="scroll-mt-14 border-t border-plum-950/[0.06] bg-white py-14 lg:scroll-mt-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead eyebrow="Good to know" title="Before you buy." />
        <dl className="mx-auto mt-8 max-w-3xl divide-y divide-plum-950/[0.08] lg:mt-12">
          {QA.map(([q, a]) => (
            <details key={q} className="group py-1" data-reveal>
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-[16px] font-bold tracking-tight text-plum-950 [&::-webkit-details-marker]:hidden lg:text-[17px]">
                <dt>{q}</dt>
                <Icon
                  name="expand_more"
                  size={22}
                  className="shrink-0 text-plum-950/45 transition-transform group-open:rotate-180"
                />
              </summary>
              <dd className="pb-4 text-[15px] leading-relaxed text-plum-950/70">
                {a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
