import { getTodayActivity } from "../../lib/queries";
import type { Metric } from "../../lib/validation";

export type TodayData = {
  kcal: number;
  kcalGoal: number;
  exerciseMinutes: number;
  exerciseGoal: number;
  steps: number;
  stepsGoal: number;
  lastSync: Date;
};

export type TodayState =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error"; message?: string }
  | { kind: "stale"; lastSync: Date; data: TodayData }
  | { kind: "partial"; data: TodayData; missing: Metric[] }
  | { kind: "ok"; data: TodayData };

const STALE_MS = 24 * 60 * 60 * 1000;

export async function loadTodayActivity(): Promise<TodayState> {
  const url = process.env.WRISTKIT_DATABASE_URL;
  if (!url) return { kind: "error", message: "WRISTKIT_DATABASE_URL not set" };

  try {
    const r = await getTodayActivity(url);
    if (!r.lastSync) return { kind: "empty" };

    const missing = [
      r.kcal === null ? ("kcal" as const) : null,
      r.exerciseMinutes === null ? ("exercise_minutes" as const) : null,
      r.steps === null ? ("steps" as const) : null,
    ].filter((x): x is Metric => x !== null);

    const data: TodayData = {
      kcal: r.kcal ?? 0,
      kcalGoal: 600,
      exerciseMinutes: r.exerciseMinutes ?? 0,
      exerciseGoal: 30,
      steps: r.steps ?? 0,
      stepsGoal: 8000,
      lastSync: r.lastSync,
    };

    const age = Date.now() - r.lastSync.getTime();
    if (age > STALE_MS) return { kind: "stale", lastSync: r.lastSync, data };
    if (missing.length) return { kind: "partial", data, missing };
    return { kind: "ok", data };
  } catch (err) {
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "unknown",
    };
  }
}
