import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { CtaLink } from "../components/CtaLink";
import { Screenshot } from "../components/Screenshot";
import { introWillRun } from "../components/Preloader";
import { gsap, SplitText, prefersReducedMotion } from "../lib/motion";

const HeroSeeds = lazy(() =>
  import("../components/HeroSeeds").then((m) => ({ default: m.HeroSeeds })),
);
import designerShot from "../assets/media/designer.webp";
import designerShotLight from "../assets/media/designer-light.webp";
import sliceHalfPurple from "../assets/brand/slice-half-purple.png";
import sliceFullPurple from "../assets/brand/slice-full-purple.png";
import sliceHalfLime from "../assets/brand/slice-half-lime.png";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const introDelay = introWillRun() ? 1.9 : 0.1;
    const ctx = gsap.context((self) => {
      const root = self.selector!;
      const split = SplitText.create(root("[data-hero-title]"), {
        type: "lines,words",
        mask: "lines",
      });
      gsap
        .timeline({ delay: introDelay, defaults: { ease: "power4.out" } })
        .from(root("[data-hero-kicker]"), { autoAlpha: 0, y: 24, duration: 0.7 })
        .from(
          split.words,
          {
            yPercent: 120,
            duration: 0.9,
            stagger: 0.045,
            // the line masks clip descenders at tight leading — drop them
            // once the reveal has played
            onComplete: () => split.revert(),
          },
          "-=0.35",
        )
        .from(root("[data-hero-sub]"), { autoAlpha: 0, y: 26, duration: 0.7 }, "-=0.5")
        .from(root("[data-hero-ctas]"), { autoAlpha: 0, y: 26, duration: 0.7 }, "-=0.5")
        .from(
          root("[data-hero-shot]"),
          { autoAlpha: 0, y: 70, scale: 0.96, duration: 1.1 },
          "-=0.45",
        );

      // Gentle scroll-away: the screenshot lags behind the scroll.
      gsap.to(root("[data-hero-shot]"), {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative overflow-hidden">
      <Suspense fallback={null}>
        <HeroSeeds />
      </Suspense>

      {/* ambient brand decor */}
      <img
        src={sliceHalfPurple}
        alt=""
        aria-hidden="true"
        width={559}
        height={554}
        data-parallax="0.35"
        className="animate-drift absolute -top-10 right-[8%] w-40 rotate-180 opacity-70 sm:w-60"
      />
      <img
        src={sliceFullPurple}
        alt=""
        aria-hidden="true"
        width={642}
        height={616}
        data-parallax="0.2"
        className="animate-drift absolute top-1/3 -left-16 w-44 opacity-40 sm:w-72 [--drift-rotate:12deg]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24">
        <p
          data-hero-kicker
          className="font-header text-xs font-semibold tracking-[0.32em] text-accent-text uppercase"
        >
          enhancing efficiency, elevating experiences
        </p>

        <h1
          data-hero-title
          className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] font-black lowercase sm:text-7xl lg:text-8xl"
        >
          say hello to screens that{" "}
          <span className="text-accent-text">run themselves.</span>
        </h1>

        <p
          data-hero-sub
          className="mt-7 max-w-xl text-lg leading-relaxed text-ink/80"
        >
          Kiwi Display Sync is the digital signage platform by Kiwi
          Technologies. Design layouts, schedule campaigns, and sync every
          screen you own — from one friendly dashboard.
        </p>

        <div data-hero-ctas className="mt-9 flex flex-wrap gap-4">
          <CtaLink href="#cta">Book a demo</CtaLink>
          <CtaLink href="#product" variant="ghost">
            See it in action
          </CtaLink>
        </div>

        <div data-hero-shot className="relative mt-16">
          <Screenshot
            reveal={false}
            dark={designerShot}
            light={designerShotLight}
            alt="The Kiwi layout designer editing a retail promo board, with the section rail and widget toolbar"
            url="kiwi.wilsonworksph.com/layouts/jms-clothing"
            className="mx-auto max-w-4xl"
          />
          <img
            src={sliceHalfLime}
            alt=""
            aria-hidden="true"
            width={559}
            height={554}
            data-parallax="0.5"
            className="absolute -right-6 -bottom-8 hidden w-28 rotate-12 lg:block"
          />
        </div>
      </div>
    </section>
  );
}
