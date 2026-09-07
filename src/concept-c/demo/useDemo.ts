import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  getScenario,
  ROTATION_MS,
  type Assignment,
  type ContentItem,
  type Playlist,
  type Scenario,
  type ScenarioId,
} from "./scenarios";

/**
 * The demo's whole "backend": a reducer over mock scenario data plus a few
 * timers. Every dashboard action pushes an assignment to one or more screens,
 * which go `syncing` → `synced` (or `published`, for fleet-wide publishes).
 * Playlists advance on a shared tick. Nothing here talks to a server.
 */
export type ScreenStatus = "synced" | "syncing" | "published";

export interface ScreenState {
  assignment: Assignment;
  status: ScreenStatus;
  playIndex: number;
  /** Bumps on every push so the display can re-run its entrance animation. */
  version: number;
}

export interface DemoState {
  scenarioId: ScenarioId;
  selectedScreenId: string;
  screens: Record<string, ScreenState>;
  publishing: boolean;
  activeScheduleId: string | null;
  activity: string;
}

type Action =
  | { type: "scenario"; id: ScenarioId }
  | { type: "selectScreen"; id: string }
  | { type: "assign"; screenIds: string[]; assignment: Assignment; publish: boolean; scheduleId: string | null; activity: string }
  | { type: "settle"; screenId: string; status: ScreenStatus }
  | { type: "tick" }
  | { type: "publishDone" };

function initial(id: ScenarioId): DemoState {
  const sc = getScenario(id);
  const screens: Record<string, ScreenState> = {};
  for (const s of sc.screens) {
    screens[s.id] = { assignment: sc.defaults[s.id], status: "synced", playIndex: 0, version: 0 };
  }
  return {
    scenarioId: id,
    selectedScreenId: sc.screens[0].id,
    screens,
    publishing: false,
    activeScheduleId: null,
    activity: `${sc.screens.length} screens online · everything in sync`,
  };
}

function reducer(state: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "scenario":
      return initial(a.id);
    case "selectScreen":
      return { ...state, selectedScreenId: a.id };
    case "assign": {
      const screens = { ...state.screens };
      for (const id of a.screenIds) {
        const s = screens[id];
        if (!s) continue;
        screens[id] = { ...s, assignment: a.assignment, status: "syncing", playIndex: 0, version: s.version + 1 };
      }
      return { ...state, screens, publishing: a.publish || state.publishing, activeScheduleId: a.scheduleId, activity: a.activity };
    }
    case "settle": {
      const s = state.screens[a.screenId];
      if (!s) return state;
      return { ...state, screens: { ...state.screens, [a.screenId]: { ...s, status: a.status } } };
    }
    case "tick": {
      let changed = false;
      const screens = { ...state.screens };
      for (const [id, s] of Object.entries(screens)) {
        if (s.assignment.type === "playlist" && s.status !== "syncing") {
          screens[id] = { ...s, playIndex: s.playIndex + 1 };
          changed = true;
        }
      }
      return changed ? { ...state, screens } : state;
    }
    case "publishDone":
      return { ...state, publishing: false };
  }
}

const SYNC_MS = 650;
const STAGGER_MS = 420;
const PUBLISHED_BADGE_MS = 3000;

export function useDemo(initialScenario: ScenarioId = "retail") {
  const [state, dispatch] = useReducer(reducer, initialScenario, initial);
  const scenario: Scenario = useMemo(() => getScenario(state.scenarioId), [state.scenarioId]);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  // Shared playlist cadence.
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: "tick" }), ROTATION_MS);
    return () => window.clearInterval(id);
  }, []);

  const selectedScreen = scenario.screens.find((s) => s.id === state.selectedScreenId) ?? scenario.screens[0];

  const push = useCallback(
    (screenIds: string[], assignment: Assignment, activity: string, opts: { publish?: boolean; scheduleId?: string | null } = {}) => {
      const publish = opts.publish ?? false;
      dispatch({ type: "assign", screenIds, assignment, publish, scheduleId: opts.scheduleId ?? null, activity });
      screenIds.forEach((id, i) => {
        const delay = SYNC_MS + (publish ? i * STAGGER_MS : 0);
        later(() => dispatch({ type: "settle", screenId: id, status: publish ? "published" : "synced" }), delay);
        if (publish) later(() => dispatch({ type: "settle", screenId: id, status: "synced" }), delay + PUBLISHED_BADGE_MS);
      });
      if (publish) later(() => dispatch({ type: "publishDone" }), SYNC_MS + screenIds.length * STAGGER_MS + 200);
    },
    [later],
  );

  const setScenario = useCallback(
    (id: ScenarioId) => {
      clearTimers();
      dispatch({ type: "scenario", id });
    },
    [clearTimers],
  );
  const selectScreen = useCallback((id: string) => dispatch({ type: "selectScreen", id }), []);

  const assignContent = useCallback(
    (contentId: string) => {
      const c = scenario.content.find((x) => x.id === contentId);
      push([selectedScreen.id], { type: "content", id: contentId }, `Pushed “${c?.title ?? contentId}” to ${selectedScreen.name}`);
    },
    [push, scenario, selectedScreen],
  );

  const assignPlaylist = useCallback(
    (playlistId: string) => {
      const p = scenario.playlists.find((x) => x.id === playlistId);
      push([selectedScreen.id], { type: "playlist", id: playlistId }, `Now rotating “${p?.name ?? playlistId}” on ${selectedScreen.name}`);
    },
    [push, scenario, selectedScreen],
  );

  const applySchedule = useCallback(
    (scheduleId: string) => {
      const sch = scenario.schedules.find((x) => x.id === scheduleId);
      if (!sch) return;
      push(scenario.screens.map((s) => s.id), sch.target, `“${sch.name}” schedule applied to all ${scenario.screens.length} screens`, { publish: true, scheduleId });
    },
    [push, scenario],
  );

  const publishAll = useCallback(() => {
    const current = state.screens[selectedScreen.id]?.assignment;
    if (!current) return;
    push(scenario.screens.map((s) => s.id), current, `Published to ${scenario.screens.length} screens across ${new Set(scenario.screens.map((s) => s.location)).size} locations`, { publish: true });
  }, [push, scenario, selectedScreen, state.screens]);

  const playlistFor = useCallback(
    (screenId: string): Playlist | null => {
      const st = state.screens[screenId];
      if (!st || st.assignment.type !== "playlist") return null;
      return scenario.playlists.find((p) => p.id === st.assignment.id) ?? null;
    },
    [scenario, state.screens],
  );

  const contentFor = useCallback(
    (screenId: string): ContentItem | null => {
      const st = state.screens[screenId];
      if (!st) return null;
      if (st.assignment.type === "content") return scenario.content.find((c) => c.id === st.assignment.id) ?? null;
      const pl = scenario.playlists.find((p) => p.id === st.assignment.id);
      if (!pl || pl.items.length === 0) return null;
      const id = pl.items[st.playIndex % pl.items.length];
      return scenario.content.find((c) => c.id === id) ?? null;
    },
    [scenario, state.screens],
  );

  return { state, scenario, selectedScreen, setScenario, selectScreen, assignContent, assignPlaylist, applySchedule, publishAll, contentFor, playlistFor };
}

export type Demo = ReturnType<typeof useDemo>;
