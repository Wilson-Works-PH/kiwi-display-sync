import { useEffect, useRef } from "react";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/material-symbols-rounded";
import "./b.css";
import { useBMotion } from "./b-motion";
import { BNav } from "./BNav";
import { BHero } from "./BHero";
import { BMarquee } from "./BMarquee";
import { BStage } from "./BStage";
import { BFeatures } from "./BFeatures";
import { BPricing } from "./BPricing";
import { BCta } from "./BCta";
import { BFooter } from "./BFooter";

/** Concept B — 1:1 implementation of the "Kiwi Site" Claude Design prototype. */
export default function BPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useBMotion(rootRef);

  // The page owns its palette (independent of the site theme tokens).
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#F1EDE1";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full overflow-x-clip bg-[#F1EDE1] text-[#2C1830]"
      style={{ fontFamily: "'Hanken Grotesk Variable', system-ui, sans-serif" }}
    >
      {/* mouse-following lime blob */}
      <div
        data-b-blob
        className="pointer-events-none fixed top-0 left-0 z-[1] size-[560px] rounded-full opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(183,210,79,0.55) 0%, rgba(183,210,79,0.18) 38%, rgba(183,210,79,0) 68%)",
          mixBlendMode: "multiply",
          transform: "translate(-50%,-50%)",
        }}
      />
      {/* custom cursor */}
      <div
        data-b-cursor
        className="pointer-events-none fixed top-0 left-0 z-[60] size-3 rounded-full bg-[#9D3A6A] opacity-0 will-change-transform"
        style={{ transform: "translate(-50%,-50%)", transition: "width .25s, height .25s, background .25s" }}
      />

      <BNav />
      <main>
        <BHero />
        <BMarquee />
        <BStage />
        <BFeatures />
        <BPricing />
        <BCta />
      </main>
      <BFooter />
    </div>
  );
}
