import { z } from "zod";

export const MetricSchema = z.enum(["kcal", "exercise_minutes", "steps"]);
export type Metric = z.infer<typeof MetricSchema>;

// The iOS Shortcut posts a flat dictionary with the three values it reads
// from Apple Health. The handler expands these into one row per metric so
// the storage layer stays time-series.
const MetricValue = z.number().finite().min(0).max(1_000_000);

export const IngestPayloadSchema = z
  .object({
    steps: MetricValue,
    moveKcal: MetricValue,
    exerciseMin: MetricValue,
  })
  .strict();
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
