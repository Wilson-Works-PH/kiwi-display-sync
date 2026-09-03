import type { ReactNode } from "react";
import { Reveal } from "../components/Reveal";
import { Screenshot } from "../components/Screenshot";
import scheduleShot from "../assets/media/schedule.webp";
import scheduleShotLight from "../assets/media/schedule-light.webp";
import displaysShot from "../assets/media/displays.webp";
import displaysShotLight from "../assets/media/displays-light.webp";
import mediaShot from "../assets/media/media-library.webp";
import mediaShotLight from "../assets/media/media-library-light.webp";

function ShowcaseRow({
  index,
  kicker,
  title,
  body,
  bullets,
  visual,
  flip = false,
}: {
  index: number;
  kicker: string;
  title: ReactNode;
  body: string;
  bullets: string[];
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="lg:flex lg:h-screen lg:w-screen lg:shrink-0 lg:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div
          className={`flex flex-col items-center gap-10 lg:gap-16 ${
            flip ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div className="flex-1">
            <Reveal>
              <p className="font-header text-xs font-semibold tracking-[0.28em] text-accent-text uppercase">
                <span className="mr-2 text-ink-faint">
                  {String(index).padStart(2, "0")}
                </span>
                {kicker}
              </p>
            </Reveal>
            <h3
              data-split-reveal
              className="font-display mt-4 text-4xl leading-[1.02] font-black lowercase sm:text-5xl"
            >
              {title}
            </h3>
            <Reveal delay={80}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/75">
                {body}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink/85">
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-0.5 size-4 shrink-0 text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="w-full max-w-xl flex-1" delay={120}>
            {visual}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="product" data-hscroll className="scroll-mt-20 overflow-hidden">
      <h2 className="sr-only">Product tour</h2>
      <div
        data-hscroll-track
        className="flex flex-col gap-24 py-24 lg:h-screen lg:w-max lg:flex-row lg:gap-0 lg:py-0"
      >
        <ShowcaseRow
          index={1}
          kicker="Scheduling"
          title={
            <>
              set it once,{" "}
              <span className="text-accent-text">it plays on time</span> — every time
            </>
          }
          body="A full calendar for your screens. Schedule layouts or whole campaigns to any display group, repeat them daily, weekly or on your own rules, and fence them into dayparts like lunch hours or closing time."
          bullets={[
            "Day, week, month and list calendar views",
            "Repeats: daily, weekdays, weekly, monthly, or custom rules",
            "Dayparts restrict playback to hours and days you pick",
            "Priority events win conflicts — the calendar flags overlaps",
          ]}
          visual={
            <Screenshot
              dark={scheduleShot}
              light={scheduleShotLight}
              alt="The schedule calendar in week view with a recurring event and the content library rail"
              url="kiwi.wilsonworksph.com/schedule"
            />
          }
        />

        <ShowcaseRow
          index={2}
          flip
          kicker="Fleet management"
          title={
            <>
              your whole fleet, <span className="text-accent-text">live</span> — not
              a guess
            </>
          }
          body="Pair a screen with a claim code in seconds. From then on you see it breathe: online status flips live, storage and last-seen at a glance, and remote actions when you need to reach out and fix something."
          bullets={[
            "Online/offline status pushed live — no refresh, no polling",
            "Remote actions: screenshot, collect now, change layout, clear cache",
            "Display groups with synchronized, lockstep playback",
            "Crash reports and fault history straight from the player",
          ]}
          visual={
            <Screenshot
              dark={displaysShot}
              light={displaysShotLight}
              alt="The displays page showing a fleet of screens with status chips and player screenshots"
              url="kiwi.wilsonworksph.com/displays"
            />
          }
        />

        <ShowcaseRow
          index={3}
          kicker="Content library"
          title={
            <>
              every asset, <span className="text-accent-text">organised</span> and
              permissioned
            </>
          }
          body="Folders with cascading permissions keep every branch and team in their lane. Uploads go straight to storage, videos and PDFs get thumbnails automatically, and your brand fonts render exactly as the player will show them."
          bullets={[
            "Images, GIFs, video and PDFs with automatic thumbnails",
            "Folder tree with per-group view, edit and delete rights",
            "Storage meters so quotas never surprise you",
            "Your own brand fonts, previewed true to the screen",
          ]}
          visual={
            <Screenshot
              dark={mediaShot}
              light={mediaShotLight}
              alt="The media library with folder tree, storage meter and a grid of assets"
              url="kiwi.wilsonworksph.com/media"
            />
          }
        />
      </div>
    </section>
  );
}
