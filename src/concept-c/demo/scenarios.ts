/**
 * Mock data for the interactive demo — four industry presets. Everything the
 * simulated dashboard shows and the simulated screens play comes from here.
 * No backend: the "content" is described, then drawn by ContentArt.
 */

import type { DeviceId } from "./devices";

export type ScenarioId = "retail" | "restaurant" | "corporate" | "government";

export type ArtKind =
  "promo" | "menu" | "kpi" | "advisory" | "welcome" | "queue" | "announce";
export type ArtTheme = "lime" | "plum" | "cream" | "leaf" | "mauve" | "dark";

export interface ArtProps {
  /** Kiwi's own screens (the welcome card) carry the brand kit: circle icon logo + lime wordmark. */
  brand?: "kiwi";
  theme: ArtTheme;
  headline: string;
  sub?: string;
  badge?: string;
  items?: { label: string; value: string }[];
  footer?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  tag: string;
  kind: ArtKind;
  art: ArtProps;
}

/**
 * Every scenario's fleet is TWO landscape screens + ONE portrait screen, and the
 * portrait one is `screens[0]` for retail (the phone demo's hero unit). The
 * desktop wall composes exactly that shape — two landscapes stacked beside one
 * standing unit balance in height; two portraits do not fit its 0.9fr column.
 */
export interface Screen {
  id: string;
  name: string;
  location: string;
  orientation: "landscape" | "portrait";
  /** Which real Kiwi product this screen is (see devices.ts). */
  device: DeviceId;
}

export interface Playlist {
  id: string;
  name: string;
  items: string[];
}

export type Assignment =
  { type: "content"; id: string } | { type: "playlist"; id: string };

export interface Schedule {
  id: string;
  name: string;
  when: string;
  target: Assignment;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  icon: string;
  workspace: string;
  blurb: string;
  screens: Screen[];
  content: ContentItem[];
  playlists: Playlist[];
  schedules: Schedule[];
  defaults: Record<string, Assignment>;
}

/** Playlist items advance on this cadence — quick enough to notice, slow enough to read. */
export const ROTATION_MS = 3200;

/** What every screen shows before the visitor publishes anything in the guided (mobile) demo. */
export const WELCOME_CONTENT: ContentItem = {
  id: "welcome",
  title: "Welcome to Kiwi",
  tag: "Default",
  kind: "welcome",
  art: {
    theme: "plum",
    headline: "Welcome to Kiwi",
    brand: "kiwi",
    sub: "This screen is waiting for its first campaign.",
    footer: "Powered by Kiwi",
  },
};

export const SCENARIOS: Scenario[] = [
  {
    id: "retail",
    label: "Retail",
    icon: "storefront",
    workspace: "Verde Apparel",
    blurb: "Promos, product ads and sale announcements across every store.",
    screens: [
      {
        id: "r-endcap",
        name: "Storefront 01",
        location: "Makati",
        orientation: "portrait",
        device: "e-poster",
      },
      {
        id: "r-checkout",
        name: "Counter Display",
        location: "BGC",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "r-window",
        name: "Window Display",
        location: "Makati",
        orientation: "landscape",
        device: "indoor-display",
      },
    ],
    content: [
      {
        id: "r-sale",
        title: "Weekend sale",
        tag: "Promo",
        kind: "promo",
        art: {
          theme: "lime",
          badge: "This weekend only",
          headline: "50% off",
          sub: "Selected denim & outerwear",
          footer: "Sat–Sun · all branches",
        },
      },
      {
        id: "r-arrivals",
        title: "New arrivals",
        tag: "Campaign",
        kind: "promo",
        art: {
          theme: "cream",
          badge: "Just landed",
          headline: "Spring edit",
          sub: "Linen shirts, light layers, sandals",
          footer: "In store now",
        },
      },
      {
        id: "r-b1t1",
        title: "Buy 1 take 1",
        tag: "Promo",
        kind: "promo",
        art: {
          theme: "plum",
          badge: "Footwear",
          headline: "Buy 1, take 1",
          sub: "All canvas sneakers",
          footer: "While stocks last",
        },
      },
      {
        id: "r-loyalty",
        title: "Loyalty app",
        tag: "Ad",
        kind: "promo",
        art: {
          theme: "leaf",
          badge: "Verde Rewards",
          headline: "Earn on every visit",
          sub: "Scan at checkout · 5% back",
          footer: "Download the app",
        },
      },
      {
        id: "r-hours",
        title: "Store hours",
        tag: "Info",
        kind: "announce",
        art: {
          theme: "dark",
          headline: "Open until 10 PM",
          sub: "Extended hours through the holidays",
          footer: "Verde Apparel · Makati",
        },
      },
    ],
    playlists: [
      {
        id: "r-pl-weekend",
        name: "Weekend promos",
        items: ["r-sale", "r-b1t1", "r-loyalty"],
      },
      {
        id: "r-pl-window",
        name: "Storefront loop",
        items: ["r-arrivals", "r-sale"],
      },
    ],
    schedules: [
      {
        id: "r-s-open",
        name: "Morning open",
        when: "6:00 – 11:00",
        target: { type: "content", id: "r-hours" },
      },
      {
        id: "r-s-day",
        name: "Peak hours",
        when: "11:00 – 20:00",
        target: { type: "playlist", id: "r-pl-weekend" },
      },
      {
        id: "r-s-eve",
        name: "Evening",
        when: "20:00 – 22:00",
        target: { type: "content", id: "r-arrivals" },
      },
    ],
    defaults: {
      "r-window": { type: "playlist", id: "r-pl-window" },
      "r-endcap": { type: "content", id: "r-sale" },
      "r-checkout": { type: "content", id: "r-loyalty" },
    },
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: "restaurant",
    workspace: "Kape & Kanin",
    blurb: "Menu boards, combos and featured meals that change with the hour.",
    screens: [
      {
        id: "f-left",
        name: "Menu board · left",
        location: "Counter",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "f-right",
        name: "Menu board · right",
        location: "Counter",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "f-drive",
        name: "Drive-thru",
        location: "Lane 1",
        orientation: "portrait",
        device: "outdoor",
      },
    ],
    content: [
      {
        id: "f-breakfast",
        title: "Breakfast menu",
        tag: "Menu",
        kind: "menu",
        art: {
          theme: "cream",
          headline: "Breakfast",
          sub: "Served 6–10 AM",
          items: [
            { label: "Tapsilog", value: "185" },
            { label: "Longsilog", value: "165" },
            { label: "Tocilog", value: "170" },
            { label: "Bangsilog", value: "195" },
            { label: "Kapeng barako", value: "80" },
            { label: "Tsokolate", value: "95" },
          ],
          footer: "Prices in PHP · add egg +25",
        },
      },
      {
        id: "f-lunch",
        title: "Lunch menu",
        tag: "Menu",
        kind: "menu",
        art: {
          theme: "plum",
          headline: "Lunch",
          sub: "11 AM – 2 PM",
          items: [
            { label: "Chicken inasal", value: "245" },
            { label: "Pork sisig", value: "230" },
            { label: "Bulalo (2–3 pax)", value: "620" },
            { label: "Kare-kare", value: "410" },
            { label: "Garlic rice", value: "45" },
            { label: "Halo-halo", value: "120" },
          ],
          footer: "Unli rice on inasal",
        },
      },
      {
        id: "f-combo",
        title: "Combo of the day",
        tag: "Promo",
        kind: "promo",
        art: {
          theme: "lime",
          badge: "Combo of the day",
          headline: "Inasal + iced tea",
          sub: "Only ₱199 · 11 AM to 2 PM",
          footer: "Kape & Kanin",
        },
      },
      {
        id: "f-featured",
        title: "Featured dessert",
        tag: "Feature",
        kind: "promo",
        art: {
          theme: "mauve",
          badge: "New",
          headline: "Ube cheesecake",
          sub: "Baked daily · ₱150 a slice",
          footer: "Ask at the counter",
        },
      },
      {
        id: "f-happy",
        title: "Happy hour",
        tag: "Promo",
        kind: "promo",
        art: {
          theme: "dark",
          badge: "3 – 6 PM",
          headline: "Happy hour",
          sub: "Buy 1 take 1 on iced coffee",
          footer: "Weekdays only",
        },
      },
    ],
    playlists: [
      {
        id: "f-pl-lunch",
        name: "Lunch rotation",
        items: ["f-lunch", "f-combo", "f-featured"],
      },
      {
        id: "f-pl-specials",
        name: "All-day specials",
        items: ["f-combo", "f-featured", "f-happy"],
      },
    ],
    schedules: [
      {
        id: "f-s-bf",
        name: "Breakfast",
        when: "6:00 – 10:00",
        target: { type: "content", id: "f-breakfast" },
      },
      {
        id: "f-s-lunch",
        name: "Lunch rush",
        when: "11:00 – 14:00",
        target: { type: "playlist", id: "f-pl-lunch" },
      },
      {
        id: "f-s-pm",
        name: "Afternoon",
        when: "15:00 – 18:00",
        target: { type: "content", id: "f-happy" },
      },
    ],
    defaults: {
      "f-left": { type: "content", id: "f-lunch" },
      "f-right": { type: "playlist", id: "f-pl-specials" },
      "f-drive": { type: "content", id: "f-combo" },
    },
  },
  {
    id: "corporate",
    label: "Corporate",
    icon: "apartment",
    workspace: "Northwind Group",
    blurb: "Welcome screens, announcements and live KPIs across offices.",
    screens: [
      {
        id: "c-sales",
        name: "Sales floor",
        location: "HQ · 12F",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "c-cafe",
        name: "Cafeteria",
        location: "HQ · 3F",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "c-lobby",
        name: "Lobby welcome",
        location: "HQ · Ground",
        orientation: "portrait",
        device: "e-poster",
      },
    ],
    content: [
      {
        id: "c-welcome",
        title: "Welcome screen",
        tag: "Welcome",
        kind: "welcome",
        art: {
          theme: "plum",
          headline: "Welcome to Northwind",
          sub: "Please check in at reception",
          footer: "Visitors · Ground floor lobby",
        },
      },
      {
        id: "c-kpi",
        title: "Q3 KPIs",
        tag: "Dashboard",
        kind: "kpi",
        art: {
          theme: "cream",
          headline: "Sales · Q3 to date",
          items: [
            { label: "Revenue", value: "₱42.8M" },
            { label: "New accounts", value: "312" },
            { label: "Win rate", value: "38%" },
            { label: "NPS", value: "61" },
          ],
          footer: "Updated hourly",
        },
      },
      {
        id: "c-townhall",
        title: "Town hall",
        tag: "Announcement",
        kind: "announce",
        art: {
          theme: "lime",
          headline: "Town hall · Friday 4 PM",
          sub: "Auditorium, 5th floor · streamed to all offices",
          footer: "Q3 results and roadmap",
        },
      },
      {
        id: "c-safety",
        title: "Safety reminder",
        tag: "Advisory",
        kind: "advisory",
        art: {
          theme: "leaf",
          badge: "Reminder",
          headline: "Fire drill at 10 AM",
          sub: "Use the stairs. Assemble at the east plaza.",
          footer: "Facilities team",
        },
      },
      {
        id: "c-cafe-menu",
        title: "Cafeteria today",
        tag: "Menu",
        kind: "menu",
        art: {
          theme: "cream",
          headline: "Cafeteria",
          sub: "Today's lunch",
          items: [
            { label: "Chicken adobo", value: "120" },
            { label: "Pinakbet", value: "95" },
            { label: "Beef caldereta", value: "140" },
            { label: "Garden salad", value: "85" },
          ],
          footer: "Vegetarian options daily",
        },
      },
    ],
    playlists: [
      {
        id: "c-pl-lobby",
        name: "Lobby loop",
        items: ["c-welcome", "c-townhall"],
      },
      {
        id: "c-pl-sales",
        name: "Sales floor",
        items: ["c-kpi", "c-townhall", "c-safety"],
      },
    ],
    schedules: [
      {
        id: "c-s-am",
        name: "Morning",
        when: "7:00 – 9:00",
        target: { type: "content", id: "c-welcome" },
      },
      {
        id: "c-s-day",
        name: "Business hours",
        when: "9:00 – 18:00",
        target: { type: "playlist", id: "c-pl-sales" },
      },
      {
        id: "c-s-th",
        name: "Town hall day",
        when: "Fri · all day",
        target: { type: "content", id: "c-townhall" },
      },
    ],
    defaults: {
      "c-lobby": { type: "playlist", id: "c-pl-lobby" },
      "c-sales": { type: "content", id: "c-kpi" },
      "c-cafe": { type: "content", id: "c-cafe-menu" },
    },
  },
  {
    id: "government",
    label: "Government",
    icon: "account_balance",
    workspace: "City Hall · Business Permits",
    blurb: "Advisories, requirements and queue numbers for public offices.",
    screens: [
      {
        id: "g-queue",
        name: "Queue display",
        location: "Lobby",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "g-wait",
        name: "Waiting area",
        location: "Window 1–6",
        orientation: "landscape",
        device: "indoor-display",
      },
      {
        id: "g-kiosk",
        name: "Entrance kiosk",
        location: "Main door",
        orientation: "portrait",
        device: "floor-standing",
      },
    ],
    content: [
      {
        id: "g-now",
        title: "Now serving",
        tag: "Queue",
        kind: "queue",
        art: {
          theme: "dark",
          headline: "B-142",
          sub: "Window 3",
          items: [
            { label: "Window 1", value: "A-088" },
            { label: "Window 2", value: "A-091" },
            { label: "Window 4", value: "C-027" },
          ],
          footer: "Please have your documents ready",
        },
      },
      {
        id: "g-typhoon",
        title: "Weather advisory",
        tag: "Advisory",
        kind: "advisory",
        art: {
          theme: "plum",
          badge: "Advisory",
          headline: "Signal No. 2 in effect",
          sub: "Offices close at 3 PM today. Transactions resume tomorrow, 8 AM.",
          footer: "City Disaster Risk Reduction Office",
        },
      },
      {
        id: "g-permit",
        title: "Permit requirements",
        tag: "Info",
        kind: "announce",
        art: {
          theme: "cream",
          headline: "Business permit renewal",
          sub: "Bring: barangay clearance, last year's permit, tax receipts, valid ID",
          footer: "Windows 1–3 · 8 AM to 5 PM",
        },
      },
      {
        id: "g-hours",
        title: "Office hours",
        tag: "Info",
        kind: "announce",
        art: {
          theme: "lime",
          headline: "Monday – Friday, 8 AM – 5 PM",
          sub: "No noon break · closed on public holidays",
          footer: "City Hall · Business Permits & Licensing",
        },
      },
      {
        id: "g-vax",
        title: "Vaccination schedule",
        tag: "Advisory",
        kind: "advisory",
        art: {
          theme: "leaf",
          badge: "Health",
          headline: "Free flu shots this week",
          sub: "City Health Office, 2nd floor · 9 AM to 3 PM",
          footer: "Bring any valid ID",
        },
      },
    ],
    playlists: [
      {
        id: "g-pl-wait",
        name: "Waiting area loop",
        items: ["g-permit", "g-hours", "g-vax"],
      },
      { id: "g-pl-adv", name: "Advisories", items: ["g-typhoon", "g-vax"] },
    ],
    schedules: [
      {
        id: "g-s-day",
        name: "Regular day",
        when: "8:00 – 17:00",
        target: { type: "playlist", id: "g-pl-wait" },
      },
      {
        id: "g-s-adv",
        name: "Advisory mode",
        when: "Manual override",
        target: { type: "content", id: "g-typhoon" },
      },
      {
        id: "g-s-queue",
        name: "Queue only",
        when: "Lobby · always",
        target: { type: "content", id: "g-now" },
      },
    ],
    defaults: {
      "g-queue": { type: "content", id: "g-now" },
      "g-wait": { type: "playlist", id: "g-pl-wait" },
      "g-kiosk": { type: "content", id: "g-hours" },
    },
  },
];

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}
