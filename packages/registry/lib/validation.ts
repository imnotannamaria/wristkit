import { z } from "zod";

export const MetricSchema = z.enum(["kcal", "exercise_minutes", "steps"]);
export type Metric = z.infer<typeof MetricSchema>;

export const IngestSampleSchema = z
  .object({
    metric: MetricSchema,
    value: z.number().finite().min(0).max(1_000_000),
    unit: z.string().min(1).max(16),
    recorded_at: z.string().datetime({ offset: true }),
    source: z.string().min(1).max(64).optional(),
  })
  .strict();
export type IngestSample = z.infer<typeof IngestSampleSchema>;

export const IngestPayloadSchema = z
  .object({
    samples: z.array(IngestSampleSchema).min(1).max(1000),
  })
  .strict();
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
