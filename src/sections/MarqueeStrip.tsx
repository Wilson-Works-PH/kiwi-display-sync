import { Marquee } from "../components/Marquee";

export function MarqueeStrip() {
  return (
    <div className="marquee-pause overflow-x-clip py-4">
      <div data-marquee-band className="rotate-[-1.2deg] scale-[1.02] border-y-4 border-plum-950 bg-lime-400 py-4 text-plum-900">
        <Marquee
          words={[
            "design",
            "schedule",
            "sync",
            "campaigns",
            "playlists",
            "dayparts",
            "displays",
          ]}
        />
      </div>
    </div>
  );
}
