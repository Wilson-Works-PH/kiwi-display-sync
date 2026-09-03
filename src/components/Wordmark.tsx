import seedsLime from "../assets/brand/seeds-lime.png";
import seedsMauve from "../assets/brand/seeds-mauve.png";

const inkClass = {
  auto: "wordmark-ink",
  lime: "text-lime-400",
  plum: "text-plum-700",
  cream: "text-cream-100",
} as const;

/**
 * Type-set "kiwi" lockup (Fraunces stands in for Grand Royal, as everywhere on
 * the site) with the official seed-splash accent and the "display sync"
 * descriptor. Text renders crisp at any size and follows the theme via
 * currentColor; `color="auto"` = lime on dark, plum on light.
 */
export function Wordmark({
  className = "",
  color = "auto",
  descriptor = "display sync",
}: {
  className?: string;
  color?: keyof typeof inkClass;
  descriptor?: string;
}) {
  const seeds = (src: string, extra = "") => (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={642}
      height={616}
      className={`absolute -top-[0.34em] -right-[0.42em] w-[0.52em] ${extra}`}
    />
  );

  return (
    <span
      className={`inline-flex flex-col items-start leading-none ${inkClass[color]} ${className}`}
    >
      <span className="relative font-display pr-[0.3em] text-[2.1em] font-black lowercase tracking-tight">
        kiwi
        {color === "auto" ? (
          <>
            {seeds(seedsLime, "dark-only")}
            {seeds(seedsMauve, "light-only")}
          </>
        ) : (
          seeds(color === "plum" ? seedsMauve : seedsLime)
        )}
      </span>
      {descriptor && (
        <span className="font-header mt-[0.34em] text-[0.7em] font-semibold lowercase tracking-[0.3em] opacity-85">
          {descriptor}
        </span>
      )}
    </span>
  );
}
