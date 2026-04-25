import { and, desc, eq, gte } from "drizzle-orm";
import { createDb } from "./db";
import { samples } from "./schema";
import type { Metric } from "./validation";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getLatestByMetric(url: string, metric: Metric) {
  const { db, close } = createDb(url);
  try {
    return await db
      .select()
      .from(samples)
      .where(and(eq(samples.metric, metric), gte(samples.recordedAt, startOfToday())))
      .orderBy(desc(samples.recordedAt))
      .limit(1);
  } finally {
    await close();
  }
}

export async function getTodayActivity(url: string) {
  const [kcal, ex, steps] = await Promise.all([
    getLatestByMetric(url, "kcal"),
    getLatestByMetric(url, "exercise_minutes"),
    getLatestByMetric(url, "steps"),
  ]);

  const lastSync =
    [kcal[0]?.ingestedAt, ex[0]?.ingestedAt, steps[0]?.ingestedAt]
      .filter((x): x is Date => Boolean(x))
      .sort((a, b) => a.getTime() - b.getTime())
      .pop() ?? null;

  return {
    kcal: kcal[0]?.value ? Number(kcal[0].value) : null,
    exerciseMinutes: ex[0]?.value ? Number(ex[0].value) : null,
    steps: steps[0]?.value ? Number(steps[0].value) : null,
    lastSync,
  };
}
