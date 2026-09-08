import { useEffect, useRef } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CFaq } from "./CFaq";
import { CHowItWorks } from "./CHowItWorks";
import { CShowcase } from "./CShowcase";
import {
  CFeatures,
  CFinalCta,
  CFooter,
  CHero,
  CNav,
  CPricing,
  CStickyCta,
  CTrust,
  CUseCases,
} from "./CSections";
import { useReveal } from "./useReveal";

/**
 * Concept C — the site. Modern SaaS landing page that SHOWS the real product:
 * a recording of the CMS in the hero, then one recording per job in
 * "See Kiwi in action". No interactive simulation (replaced 2026-09-07).
 */
export default function CPage() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div ref={root} className="c-root antialiased">
      <CNav />
      <main>
        {/* Order (brief, 2026-09-08): proof, the compact workflow overview, then the recordings carry
            the feature explanation; extras, industries, pricing, buying answers,
            the demo invitation. */}
        <CHero />
        <CTrust />
        <CHowItWorks />
        <CShowcase />
        <CFeatures />
        <CUseCases />
        <CPricing />
        <CFaq />
        <CFinalCta />
      </main>
      <CFooter />
      <CStickyCta />
    </div>
  );
}
