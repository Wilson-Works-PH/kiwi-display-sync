import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/motion";

/**
 * Site-wide motion: Lenis smooth scrolling synced to ScrollTrigger, plus
 * declarative effects driven by data attributes:
 *
 * - [data-parallax="0.3"]   — element drifts vertically while scrolling past
 * - [data-marquee-band]     — skews with scroll velocity
 * - [data-split-reveal]     — heading lines rise out of a mask on scroll
 * - [data-split-chars]      — characters cascade up on scroll
 * - [data-shot-reveal]      — framed screenshot unclips + settles on scroll
 * - [data-magnetic]         — element leans toward the pointer
 * - [data-hscroll]/[data-hscroll-track] — pinned horizontal gallery (desktop)
 *
 * Everything is skipped for prefers-reduced-motion users.
 */
export function MotionRoot() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Lenis only where it helps: wheel input on fine-pointer devices. On
    // touch it fights native scrolling and makes sticky elements jitter.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    if (finePointer) {
      lenis = new Lenis({ duration: 1.1 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onAnchorClick = (e: Event) => {
      if (!lenis) return; // native smooth scroll handles anchors on touch
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href") ?? "");
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -64 });
    };
    document.addEventListener("click", onAnchorClick);

    const magnetCleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // ---- vertical parallax on decorated elements -------------------------
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const factor = parseFloat(el.dataset.parallax ?? "0.3");
        gsap.fromTo(
          el,
          { y: 90 * factor },
          {
            y: -90 * factor,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // ---- marquee skews with scroll velocity ------------------------------
      const band = document.querySelector<HTMLElement>("[data-marquee-band]");
      if (band) {
        const skewTo = gsap.quickTo(band, "skewX", { duration: 0.5, ease: "power3" });
        ScrollTrigger.create({
          onUpdate: (self) => {
            skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -350));
          },
        });
      }

      // ---- pinned horizontal showcase gallery (desktop only) ---------------
      const mm = gsap.matchMedia();
      let containerAnim: gsap.core.Tween | undefined;
      const hs = document.querySelector<HTMLElement>("[data-hscroll]");
      const track = document.querySelector<HTMLElement>("[data-hscroll-track]");
      if (hs && track) {
        mm.add("(min-width: 1024px)", () => {
          const amount = () => track.scrollWidth - window.innerWidth;
          containerAnim = gsap.to(track, {
            x: () => -amount(),
            ease: "none",
            scrollTrigger: {
              trigger: hs,
              start: "top top",
              end: () => "+=" + amount(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          return () => {
            containerAnim = undefined;
          };
        });
      }

      // ---- masked line reveals for big headings ----------------------------
      gsap.utils.toArray<HTMLElement>("[data-split-reveal]").forEach((el) => {
        const inHscroll = !!el.closest("[data-hscroll]");
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        const useContainer = inHscroll && !!containerAnim;
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.09,
          ease: "power4.out",
          // masks clip descenders at tight leading — restore the raw
          // heading once the reveal has played
          onComplete: () => split.revert(),
          scrollTrigger: {
            trigger: el,
            start: useContainer ? "left 85%" : "top 85%",
            once: true,
            ...(useContainer ? { containerAnimation: containerAnim } : {}),
          },
        });
      });

      // ---- character cascade (closing statement) ---------------------------
      gsap.utils.toArray<HTMLElement>("[data-split-chars]").forEach((el) => {
        const split = SplitText.create(el, { type: "chars,words", mask: "words" });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.7,
          stagger: 0.025,
          ease: "back.out(1.6)",
          onComplete: () => split.revert(),
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // ---- framed screenshot unclip --------------------------------------
      gsap.utils
        .toArray<HTMLElement>("[data-shot-reveal]")
        .filter((el) => !el.closest("[data-hscroll]"))
        .forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 10% 14% 10% round 24px)", scale: 0.94 },
            {
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });

      // ---- magnetic buttons ------------------------------------------------
      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          magnetCleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
      }
    });

    // Fonts shifting line boxes after split → re-measure once loaded.
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      document.removeEventListener("click", onAnchorClick);
      magnetCleanups.forEach((fn) => fn());
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
