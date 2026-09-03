import seedsPlum from "../assets/brand/seeds-plum.png";

/** Infinite scrolling word band, agency-style. Content is duplicated so the
 *  -50% translate loops seamlessly. */
export function Marquee({ words }: { words: string[] }) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="font-display px-6 text-2xl font-black lowercase sm:px-10 sm:text-4xl">
            {word}
          </span>
          <img
            src={seedsPlum}
            alt=""
            width={642}
            height={616}
            className="w-6 sm:w-8"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
