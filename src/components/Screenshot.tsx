import { BrowserFrame } from "./BrowserFrame";
import { useTheme } from "../lib/theme";

/** A real product screenshot in a browser frame, swapping with the site theme. */
export function Screenshot({
  dark,
  light,
  alt,
  url,
  className = "",
  reveal = true,
}: {
  dark: string;
  /** Light-mode variant; falls back to the dark capture if not provided. */
  light?: string;
  alt: string;
  url: string;
  className?: string;
  /** Scroll-triggered unclip animation (disable when a parent animates it). */
  reveal?: boolean;
}) {
  const { theme } = useTheme();
  const src = theme === "light" && light ? light : dark;
  return (
    <div {...(reveal ? { "data-shot-reveal": "" } : {})}>
      <BrowserFrame className={className} url={url}>
        <img
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          loading="lazy"
          className="block w-full"
        />
      </BrowserFrame>
    </div>
  );
}
