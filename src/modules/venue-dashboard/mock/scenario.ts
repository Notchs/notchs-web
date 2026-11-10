import { bumpDataVersion } from "../services/data-version";

/**
 * Team preview only: lets reviewers see each page's other states (empty,
 * offline, loading, error...) from the "Example data" menu. Real API data
 * never passes through here.
 */
export type ScenarioPage =
  | "overview"
  | "customers"
  | "visits"
  | "analytics"
  | "reviews"
  | "discover"
  | "rewards"
  | "counter"
  | "venue-page"
  | "team"
  | "billing"
  | "settings";

const MOCK_LATENCY_MS = 350;
const COMMON_STATES = ["Loading", "Error"] as const;

const pageStates: Record<ScenarioPage, readonly string[]> = {
  overview: ["First days", "Counter off"],
  customers: ["Empty"],
  visits: ["Card not ready"],
  analytics: [],
  reviews: ["No ratings yet"],
  discover: ["Map error"],
  rewards: ["Not available yet"],
  counter: ["Offline", "Not paired"],
  "venue-page": [],
  team: ["Not available yet"],
  billing: ["Paying", "Payment failed"],
  settings: [],
};

const active = new Map<ScenarioPage, string>();

export const scenariosFor = (page: ScenarioPage) => [
  "Normal",
  ...pageStates[page],
  ...COMMON_STATES,
];

export const getScenario = (page: ScenarioPage) => active.get(page) ?? "Normal";

export function setScenario(page: ScenarioPage, scenario: string) {
  active.set(page, scenario);
  bumpDataVersion();
}

/** Holds a request open or fails it, as the scenario asks. */
export async function applyRequestScenario(page: ScenarioPage) {
  const scenario = getScenario(page);
  if (scenario === "Loading") await new Promise(() => {});
  if (scenario === "Error") throw new Error("Example failure");
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
}
