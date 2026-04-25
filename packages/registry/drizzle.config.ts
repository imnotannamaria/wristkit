import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./schemas",
  dialect: "postgresql",
} satisfies Config;
