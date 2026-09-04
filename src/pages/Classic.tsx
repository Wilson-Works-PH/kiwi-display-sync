import { useEffect } from "react";
import { MotionRoot } from "../components/MotionRoot";
import { Preloader } from "../components/Preloader";
import { Nav } from "../sections/Nav";
import { Hero } from "../sections/Hero";
import { MarqueeStrip } from "../sections/MarqueeStrip";
import { Showcase } from "../sections/Showcase";
import { WatchItWork } from "../sections/WatchItWork";
import { Features } from "../sections/Features";
import { HowItWorks } from "../sections/HowItWorks";
import { Pricing } from "../sections/Pricing";
import { Faq } from "../sections/Faq";
import { CtaBand } from "../sections/CtaBand";
import { Footer } from "../sections/Footer";

export default function Classic() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <MotionRoot />
      <Nav />
      <main>
        <Hero />
        <MarqueeStrip />
        <Showcase />
        <WatchItWork />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <Preloader />
    </>
  );
}
