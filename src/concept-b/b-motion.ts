import { useEffect, type RefObject } from "react";

/**
 * Motion system for concept B, ported 1:1 from the Claude Design prototype's
 * runtime script: word cascade, scroll reveals + counters, condensing nav that
 * inverts over dark sections, scroll-rotating kiwis, the 3D product stage,
 * viewport-centered parallax, magnetic buttons, tilt cards, and the custom
 * cursor + lime blob (fine pointers only).
 */
export function useBMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const R = rootRef.current;
    if (!R) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const cleanups: (() => void)[] = [];

    // ---- hero headline word reveal ----
    const words = [...R.querySelectorAll<HTMLElement>("[data-b-word]")];
    if (!reduced) {
      words.forEach((w) => {
        w.style.transform = "translateY(115%) rotate(3deg)";
        w.style.opacity = "0";
      });
      requestAnimationFrame(() => {
        words.forEach((w, i) => {
          w.style.transition = `transform 1.1s cubic-bezier(.16,1,.3,1) ${120 + i * 110}ms, opacity .6s ease ${120 + i * 110}ms`;
          w.style.transform = "translateY(0) rotate(0deg)";
          w.style.opacity = "1";
        });
      });
    }

    // ---- counters ----
    const count = (el: HTMLElement) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = parseInt(el.dataset.count || "0");
      if (reduced) {
        el.textContent = target.toLocaleString();
        return;
      }
      const dur = 1400;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // ---- reveal-on-scroll ----
    const revs = [...R.querySelectorAll<HTMLElement>("[data-b-reveal]")];
    let io: IntersectionObserver | undefined;
    if (!reduced) {
      revs.forEach((el) => {
        el.dataset.baseT = el.style.transform || "";
        el.style.opacity = "0";
        el.style.transform = `${el.dataset.baseT} translateY(34px)`.trim();
      });
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            const d = parseInt(el.dataset.delay || "0");
            el.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${d}ms, transform 1s cubic-bezier(.16,1,.3,1) ${d}ms`;
            el.style.opacity = "1";
            el.style.transform = el.dataset.baseT || "";
            io!.unobserve(el);
            el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      revs.forEach((el) => io!.observe(el));
      cleanups.push(() => io!.disconnect());
    }
    R.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
      if (reduced || !c.closest("[data-b-reveal]")) count(c);
    });

    // ---- motion targets ----
    const nav = R.querySelector<HTMLElement>("[data-b-nav]");
    const navLinks = [...R.querySelectorAll<HTMLElement>("[data-b-navlink]")];
    const navMark = R.querySelector<HTMLElement>("[data-b-navmark]");
    const navCta = R.querySelector<HTMLElement>("[data-b-navcta]");
    const darkSecs = [...R.querySelectorAll<HTMLElement>("[data-b-dark]")];
    const kiwi = R.querySelector<HTMLElement>("[data-b-kiwi]");
    const kiwi2 = R.querySelector<HTMLElement>("[data-b-kiwi2]");
    const blob = R.querySelector<HTMLElement>("[data-b-blob]");
    const cursor = R.querySelector<HTMLElement>("[data-b-cursor]");
    const hero = R.querySelector<HTMLElement>("[data-b-hero]");
    const stageSec = R.querySelector<HTMLElement>("[data-b-stage-section]");
    const cards = [...R.querySelectorAll<HTMLElement>("[data-b-card]")];
    const dots = [...R.querySelectorAll<HTMLElement>("[data-b-dot]")];
    const caps = [...R.querySelectorAll<HTMLElement>("[data-b-cap]")];
    const paras = [...R.querySelectorAll<HTMLElement>("[data-b-parallax]")];

    if (blob && fine) blob.style.opacity = "1";
    if (cursor && fine && !reduced) {
      document.body.style.cursor = "none";
      cleanups.push(() => {
        document.body.style.cursor = "";
      });
    }

    // ---- magnetic buttons ----
    if (fine && !reduced) {
      R.querySelectorAll<HTMLElement>("[data-b-magnet]").forEach((el) => {
        el.style.transition = `${el.style.transition ? el.style.transition + "," : ""}transform .5s cubic-bezier(.16,1,.3,1)`;
        const mv = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${dx * 0.28}px,${dy * 0.28}px)`;
        };
        const lv = () => {
          el.style.transform = "translate(0,0)";
        };
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", lv);
        cleanups.push(() => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", lv);
        });
      });

      // ---- tilt cards ----
      R.querySelectorAll<HTMLElement>("[data-b-tilt],[data-b-price]").forEach((el) => {
        const isPrice = el.hasAttribute("data-b-price");
        el.style.transformStyle = "preserve-3d";
        const mv = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          const amp = isPrice ? 6 : 5;
          el.style.transition = "transform .25s ease-out, box-shadow .35s";
          el.style.transform = `${el.dataset.baseT || ""} perspective(1100px) rotateX(${-py * amp}deg) rotateY(${px * amp}deg) translateY(-4px)`;
          if (isPrice) el.style.boxShadow = "0 40px 80px -30px rgba(44,24,48,0.45)";
        };
        const lv = () => {
          el.style.transition = "transform .7s cubic-bezier(.16,1,.3,1), box-shadow .5s";
          el.style.transform = el.dataset.baseT || "";
          if (isPrice) el.style.boxShadow = "";
        };
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", lv);
        cleanups.push(() => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", lv);
        });
      });
    }

    // ---- scroll frame ----
    let navDark: boolean | undefined;
    const onFrame = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const vh = window.innerHeight || 1;
      if (nav) {
        const on = y > 40;
        nav.style.padding = on ? "12px clamp(20px,5vw,48px)" : "22px clamp(20px,5vw,48px)";
        nav.style.backdropFilter = on ? "blur(14px)" : "blur(0px)";
        const navH = nav.offsetHeight || 64;
        const probe = navH / 2;
        const overDark = darkSecs.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        });
        if (overDark !== navDark) {
          navDark = overDark;
          navLinks.forEach((a) => {
            a.style.color = overDark ? "#F7EFF3" : "#2C1830";
          });
          if (navMark) navMark.style.color = overDark ? "#E084AF" : "#9D3A6A";
          if (navCta) {
            navCta.style.background = overDark ? "#B7D24F" : "#2C1830";
            navCta.style.color = overDark ? "#2C1830" : "#FFFFFF";
          }
        }
        nav.style.background = on
          ? overDark
            ? "rgba(44,24,48,0.72)"
            : "rgba(241,237,225,0.82)"
          : "transparent";
        nav.style.boxShadow = on
          ? overDark
            ? "0 1px 0 rgba(255,255,255,0.08)"
            : "0 1px 0 rgba(44,24,48,0.08)"
          : "none";
      }
      if (kiwi && !reduced) {
        kiwi.style.transform = `translateY(${y * 0.28}px) rotate(${y * 0.06}deg)`;
      }
      if (hero) {
        const fade = Math.max(0, 1 - y / (vh * 0.9));
        hero.style.opacity = String(0.15 + fade * 0.85);
      }
      if (stageSec && cards.length) {
        const r = stageSec.getBoundingClientRect();
        const start = vh * 0.95;
        const end = -r.height * 0.35;
        const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
        const spread = Math.min(1, p * 1.6);
        const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
        cards.forEach((c, i) => {
          const off = i - 1;
          const rotX = (1 - spread) * 22;
          const tz = -Math.abs(off) * (160 - spread * 40);
          const tx = off * (spread * 20) + off * (1 - spread) * 6;
          const ty = off * (1 - spread) * 70;
          const sc = 1 - Math.abs(off) * 0.06;
          const active = i === idx;
          const lift = active ? -(p > 0.34 ? 26 : 0) : 0;
          c.style.zIndex = String(active ? 3 : 2 - Math.abs(off));
          c.style.transform = `translate(-50%,-50%) rotateX(${rotX}deg) translate3d(${tx}%,${ty + lift}px,${tz + (active ? 120 : 0)}px) scale(${active ? 1 : sc})`;
          c.style.filter = active ? "brightness(1)" : "brightness(0.7)";
          c.style.transition = reduced
            ? "none"
            : "transform .6s cubic-bezier(.16,1,.3,1), filter .5s";
        });
        dots.forEach((d, i) => {
          d.style.width = i === idx ? "28px" : "6px";
          d.style.background = i === idx ? "#B7D24F" : "rgba(255,255,255,0.25)";
        });
        caps.forEach((c, i) => {
          c.style.color = i === idx ? "#B7D24F" : "rgba(255,255,255,0.62)";
        });
      }
      if (!reduced) {
        paras.forEach((el) => {
          const r = el.getBoundingClientRect();
          const c = r.top + r.height / 2 - vh / 2;
          const f = parseFloat(el.dataset.bParallax || "0.1");
          el.style.transform = `translateY(${c * f}px)`;
        });
      }
      if (kiwi2 && !reduced) {
        const r = kiwi2.getBoundingClientRect();
        const c = r.top + r.height / 2 - vh / 2;
        kiwi2.style.transform = `rotate(${c * 0.05}deg)`;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          onFrame();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onFrame);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onFrame);
    });
    onFrame();

    // ---- cursor + blob loop ----
    let raf = 0;
    if (fine) {
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let bx = mx, by = my, cx = mx, cy = my;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        if (cursor && !reduced) cursor.style.opacity = "1";
        const t = e.target as HTMLElement | null;
        const hot = t?.closest?.("a,button,[data-b-magnet],[data-b-card]");
        if (cursor) {
          cursor.style.width = hot ? "44px" : "12px";
          cursor.style.height = hot ? "44px" : "12px";
          cursor.style.background = hot ? "rgba(157,58,106,0.22)" : "#9D3A6A";
          cursor.style.border = hot ? "1.5px solid #9D3A6A" : "none";
        }
      };
      const onLeave = () => {
        if (cursor) cursor.style.opacity = "0";
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseleave", onLeave);
      });
      const loop = () => {
        bx += (mx - bx) * 0.08;
        by += (my - by) * 0.08;
        cx += (mx - cx) * 0.35;
        cy += (my - cy) * 0.35;
        if (blob) blob.style.transform = `translate(${bx - 280}px,${by - 280}px)`;
        if (cursor) cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef]);
}
