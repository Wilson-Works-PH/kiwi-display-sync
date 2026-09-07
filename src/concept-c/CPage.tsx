import { useEffect, useRef } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CHowItWorks } from "./CHowItWorks";
import { CShowcase } from "./CShowcase";
import {
  CBenefits,
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
        <CHero />
        <CTrust />
        <CShowcase />
        <CFeatures />
        <CHowItWorks />
        <CUseCases />
        <CBenefits />
        <CPricing />
        <CFinalCta />
      </main>
      <CFooter />
      <CStickyCta />
    </div>
  );
}
