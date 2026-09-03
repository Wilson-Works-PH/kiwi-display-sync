import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import wordmarkLime from "../assets/brand/wordmark-lime.png";
import seedsLime from "../assets/brand/seeds-lime.png";
import seedsMauve from "../assets/brand/seeds-mauve.png";

export const INTRO_KEY = "kds:intro-seen";

// eslint-disable-next-line react-refresh/only-export-components
export function introWillRun() {
  try {
    return !sessionStorage.getItem(INTRO_KEY) && !prefersReducedMotion();
  } catch {
    return false;
  }
}

/** Once-per-session branded intro: seeds pop, the wordmark rises, the plum
 *  curtain lifts. */
export function Preloader() {
  const [show] = useState(introWillRun);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    document.documentElement.style.overflow = "hidden";
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setDone(true);
          },
        })
        .from(q("[data-intro-seed]"), {
          scale: 0,
          rotation: -120,
          transformOrigin: "50% 50%",
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(2.2)",
        })
        .from(
          q("[data-intro-mark]"),
          { yPercent: 130, autoAlpha: 0, duration: 0.7, ease: "power4.out" },
          "-=0.25",
        )
        .to(q("[data-intro-panel]"), { delay: 0.35, duration: 0.05 })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        });
    }, rootRef);
    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, [show]);

  if (!show || done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-plum-950"
    >
      <div data-intro-panel className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <img data-intro-seed src={seedsLime} alt="" width={642} height={616} className="w-8" />
          <img data-intro-seed src={seedsMauve} alt="" width={642} height={616} className="w-6" />
          <img data-intro-seed src={seedsLime} alt="" width={642} height={616} className="w-4" />
        </div>
        <div className="overflow-hidden">
          <img
            data-intro-mark
            src={wordmarkLime}
            alt=""
            width={1241}
            height={618}
            className="h-14 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
