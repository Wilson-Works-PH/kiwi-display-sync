import { Reveal } from "../components/Reveal";
import { CtaLink } from "../components/CtaLink";
import sliceHalfPurple from "../assets/brand/slice-half-purple.png";
import sliceFullPurple from "../assets/brand/slice-full-purple.png";

export function CtaBand() {
  return (
    <section id="cta" className="relative scroll-mt-20 overflow-hidden bg-lime-400 py-24 text-plum-900">
      <img
        src={sliceHalfPurple}
        alt=""
        aria-hidden="true"
        width={559}
        height={554}
        data-parallax="0.3"
        className="absolute -top-14 -left-14 w-56 -rotate-12 opacity-90"
      />
      <img
        src={sliceFullPurple}
        alt=""
        aria-hidden="true"
        width={642}
        height={616}
        data-parallax="0.45"
        className="absolute -right-20 -bottom-20 w-72 rotate-45 opacity-90"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 data-split-chars className="font-display text-5xl leading-[0.95] font-black lowercase sm:text-7xl">
            the future is kiwi.
          </h2>
          <p className="font-header mx-auto mt-6 max-w-xl text-lg text-plum-800">
            See your own content running on a live screen in a 30-minute demo.
            Bring your worst menu board — we'll bring the platform.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <CtaLink
              href="mailto:contact@wilsonworksph.com?subject=Kiwi%20Display%20Sync%20demo"
              className="!bg-plum-900 !text-lime-400 hover:!bg-plum-800"
            >
              Book a demo
            </CtaLink>
            <CtaLink
              href="mailto:contact@wilsonworksph.com"
              variant="ghost"
              className="!border-plum-900/60 !text-plum-900 hover:!border-plum-900 hover:!text-plum-900"
            >
              Talk to sales
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
