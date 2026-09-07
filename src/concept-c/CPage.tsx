import { useEffect, useRef } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CDemo } from "./CDemo";
import {
  CBenefits,
  CFeatures,
  CFinalCta,
  CFooter,
  CHero,
  CHowItWorks,
  CNav,
  CPricing,
  CStickyCta,
  CTrust,
  CUseCases,
} from "./CSections";
import { useDemo } from "./demo/useDemo";
import { useMediaQuery } from "./useMediaQuery";
import { useReveal } from "./useReveal";

/**
 * Concept C — modern SaaS landing page with the interactive demo as its
 * centerpiece. Two independent demo instances: the hero mockup plays on its
 * own (non-interactive), the "See Kiwi in action" section is the live one.
 */
export default function CPage() {
  const root = useRef<HTMLDivElement>(null);
  const heroDemo = useDemo("retail");
  const demo = useDemo("retail");
  const desktop = useMediaQuery("(min-width: 1024px)");
  useReveal(root);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div ref={root} className="c-root antialiased">
      <CNav />
      <main>
        <CHero demo={heroDemo} />
        {/* Phones reach the interactive demo one swipe after the hero; the benefit
            statement follows it. Desktop keeps the original order. */}
        {desktop ? (
          <>
            <CTrust />
            <CDemo demo={demo} />
          </>
        ) : (
          <>
            <CDemo demo={demo} />
            <CTrust />
          </>
        )}
        <CFeatures />
        <CHowItWorks />
        <CUseCases onPick={demo.setScenario} />
        <CBenefits />
        <CPricing />
        <CFinalCta />
      </main>
      <CFooter />
      <CStickyCta />
    </div>
  );
}
