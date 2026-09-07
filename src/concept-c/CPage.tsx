import { useEffect, useRef } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CDemo } from "./CDemo";
import { CBenefits, CFeatures, CFinalCta, CFooter, CHero, CHowItWorks, CNav, CPricing, CTrust, CUseCases } from "./CSections";
import { useDemo } from "./demo/useDemo";
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
  useReveal(root);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div ref={root} className="c-root font-header antialiased">
      <CNav />
      <main>
        <CHero demo={heroDemo} />
        <CTrust />
        <CDemo demo={demo} />
        <CFeatures />
        <CHowItWorks />
        <CUseCases onPick={demo.setScenario} />
        <CBenefits />
        <CPricing />
        <CFinalCta />
      </main>
      <CFooter />
    </div>
  );
}
