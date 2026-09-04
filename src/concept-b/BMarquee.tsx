const SERIF = "'Newsreader Variable', Georgia, serif";

const WORDS: { text: string; kind: "outline" | "fill" | "italic"; dot: string }[] = [
  { text: "Displays", kind: "outline", dot: "#B7D24F" },
  { text: "Layouts", kind: "fill", dot: "#9D3A6A" },
  { text: "Schedules", kind: "outline", dot: "#B7D24F" },
  { text: "Dayparts", kind: "italic", dot: "#71864F" },
  { text: "Campaigns", kind: "outline", dot: "#B7D24F" },
  { text: "Media", kind: "fill", dot: "#9D3A6A" },
  { text: "Widgets", kind: "outline", dot: "#71864F" },
  { text: "Access control", kind: "italic", dot: "#B7D24F" },
];

function Row() {
  return (
    <div
      className="flex items-center gap-9 pr-9 font-semibold whitespace-nowrap"
      style={{
        fontFamily: SERIF,
        fontSize: "clamp(40px,5.6vw,84px)",
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}
    >
      {WORDS.map((w) => (
        <span key={w.text} className="flex items-center gap-9">
          <span
            className={
              w.kind === "italic" ? "font-medium text-[#9D3A6A] italic" : undefined
            }
            style={
              w.kind === "outline"
                ? { color: "transparent", WebkitTextStroke: "1.5px #2C1830" }
                : w.kind === "fill"
                  ? { color: "#2C1830" }
                  : undefined
            }
          >
            {w.text}
          </span>
          <span className="size-4 flex-none rounded-full" style={{ background: w.dot }} />
        </span>
      ))}
    </div>
  );
}

export function BMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-[#2C1830]/10 bg-[#F1EDE1] py-[26px]">
      <div
        className="flex w-max will-change-transform"
        style={{ animation: "bmarquee 38s linear infinite" }}
      >
        <Row />
        <Row />
      </div>
    </section>
  );
}
