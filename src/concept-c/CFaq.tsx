import { useState } from "react";
import { cx } from "./cx";
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
 *
 * Disclosure is a controlled accordion rather than <details> so the answer's height can animate
 * (`.c-collapse` in c.css, 0fr → 1fr) and the chevron can turn with it; several can be open at once,
 * as they could before. Under prefers-reduced-motion it opens instantly.
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
  const [openSet, setOpenSet] = useState<ReadonlySet<number>>(() => new Set());
  const toggle = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });
  return (
    <section
      id="faq"
      className="scroll-mt-14 border-t border-plum-950/[0.06] bg-white py-14 lg:scroll-mt-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* The break is explicit: left to wrap on its own, "Let’s" is orphaned at the
            end of line 1 at every width the heading wraps at (390: 294px of 335). */}
        <SectionHead
          eyebrow="FAQ"
          title={
            <>
              Got Questions?
              <br />
              Let’s Talk Solutions.
            </>
          }
        />
        <dl className="mx-auto mt-8 max-w-3xl divide-y divide-plum-950/[0.08] lg:mt-12">
          {QA.map(([q, a], i) => {
            const open = openSet.has(i);
            return (
              <div key={q} className="py-1" data-reveal>
                <dt>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => toggle(i)}
                    className="flex w-full min-h-[52px] items-center justify-between gap-4 py-3 text-left text-[16px] font-bold tracking-tight text-plum-950 transition-colors hover:text-plum-700 lg:text-[17px]"
                  >
                    {q}
                    <Icon
                      name="expand_more"
                      size={22}
                      className={cx(
                        "shrink-0 text-plum-950/45 transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${i}`}
                  className={cx("c-collapse", open && "is-open")}
                  aria-hidden={!open}
                >
                  <div>
                    <p className="pb-4 text-[15px] leading-relaxed text-plum-950/70">
                      {a}
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
