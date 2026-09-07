import { useParams, useSearchParams } from "react-router-dom";
import "./c.css";
import { ContentArt } from "./demo/ContentArt";
import { SCENARIOS, WELCOME_CONTENT } from "./demo/scenarios";

/**
 * Dev helper, not linked anywhere: renders one piece of drawn demo content
 * full-viewport so it can be screenshotted as real media for the CMS demo
 * tenant (1920×1080 or 1080×1920 PNGs → upload → layouts → recordings).
 *
 *   /art/retail/0          first retail content item
 *   /art/welcome           Kiwi's welcome card
 *   ?list=1                prints the scenario's content ids/titles instead
 */
export default function ArtPage() {
  const { scenario = "retail", index = "0" } = useParams();
  const [q] = useSearchParams();
  const sc = SCENARIOS.find((s) => s.id === scenario);
  const item =
    scenario === "welcome" ? WELCOME_CONTENT : sc?.content[Number(index)];
  if (q.get("list")) {
    return (
      <pre className="p-4 text-[13px]">
        {SCENARIOS.map(
          (s) =>
            `${s.id}\n${s.content.map((c, i) => `  ${i}  ${c.id}  ${c.title}  (${c.kind})`).join("\n")}`,
        ).join("\n")}
      </pre>
    );
  }
  if (!item) return <pre className="p-4">unknown scenario/index</pre>;
  return (
    <div
      className="c-root font-header fixed inset-0"
      style={{ containerType: "inline-size" }}
    >
      <ContentArt kind={item.kind} art={item.art} />
    </div>
  );
}
