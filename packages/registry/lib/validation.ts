import { z } from "zod";

export const MetricSchema = z.enum(["kcal", "exercise_minutes", "steps"]);
export type Metric = z.infer<typeof MetricSchema>;

export const IngestSampleSchema = z.object({
  metric: MetricSchema,
  value: z.number(),
  unit: z.string().min(1),
  recorded_at: z.string().datetime({ offset: true }),
  source: z.string().min(1).optional(),
});
export type IngestSample = z.infer<typeof IngestSampleSchema>;

export const IngestPayloadSchema = z.object({
  samples: z.array(IngestSampleSchema).min(1).max(1000),
});
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
