"use client";

import type { TodayData } from "../../../../packages/registry/components/today-activity-card/load";
import {
  ActivityRings,
  TodayActivityCardStale as StaleCard,
  TodayActivityCardEmpty,
  TodayActivityCardError,
  TodayActivityCardLoading,
  TodayActivityCardOk,
} from "../../../../packages/registry/components/today-activity-card/states";

export { TodayActivityCardEmpty, TodayActivityCardError, TodayActivityCardLoading };

export const DEMO_ACTIVITY: TodayData = {
  kcal: 544,
  kcalGoal: 600,
  exerciseMinutes: 80,
  exerciseGoal: 30,
  steps: 6480,
  stepsGoal: 8000,
  lastSyncIso: "2026-04-26T21:14:00Z",
  lastSyncLabel: "21:14",
  hoursSinceSync: 0,
};

type DemoProps = {
  moveKcal?: number;
  exerciseMin?: number;
  steps?: number;
  moveGoal?: number;
  exerciseGoal?: number;
  stepsGoal?: number;
  updatedAt?: string;
};

export function TodayActivityCardDemo({
  moveKcal,
  exerciseMin,
  steps,
  moveGoal,
  exerciseGoal,
  stepsGoal,
  updatedAt,
}: DemoProps = {}) {
  return (
    <TodayActivityCardOk
      data={{
        ...DEMO_ACTIVITY,
        kcal: moveKcal ?? DEMO_ACTIVITY.kcal,
        exerciseMinutes: exerciseMin ?? DEMO_ACTIVITY.exerciseMinutes,
        steps: steps ?? DEMO_ACTIVITY.steps,
        kcalGoal: moveGoal ?? DEMO_ACTIVITY.kcalGoal,
        exerciseGoal: exerciseGoal ?? DEMO_ACTIVITY.exerciseGoal,
        stepsGoal: stepsGoal ?? DEMO_ACTIVITY.stepsGoal,
        lastSyncLabel: updatedAt ?? DEMO_ACTIVITY.lastSyncLabel,
      }}
    />
  );
}

export function TodayActivityCardStale() {
  return (
    <StaleCard
      data={{ ...DEMO_ACTIVITY, kcal: 412, exerciseMinutes: 18, steps: 4280, hoursSinceSync: 30 }}
    />
  );
}

export function TodayActivityCardRingsOnly() {
  return (
    <div className="wk-rings-only py-8">
      <ActivityRings data={DEMO_ACTIVITY} />
    </div>
  );
}
