import path from "node:path";
import { z } from "zod";
import { pathExists, readJson, writeJson } from "./fs.js";

export const ComponentsJsonSchema = z.object({
  $schema: z.string().optional(),
  wristkit: z.object({
    version: z.number().int(),
    registry: z.string().min(1),
    theme: z.string().min(1),
    paths: z.object({
      components: z.string().min(1),
      lib: z.string().min(1),
      handler: z.string().min(1),
    }),
  }),
});

export type ComponentsJson = z.infer<typeof ComponentsJsonSchema>;

export function componentsJsonPath(cwd: string): string {
  return path.join(cwd, "components.json");
}

export async function readComponentsJson(cwd: string): Promise<ComponentsJson> {
  const p = componentsJsonPath(cwd);
  const raw = await readJson<unknown>(p);
  return ComponentsJsonSchema.parse(raw);
}

export async function writeComponentsJson(cwd: string, value: ComponentsJson): Promise<void> {
  await writeJson(componentsJsonPath(cwd), value);
}

export async function hasComponentsJson(cwd: string): Promise<boolean> {
  return await pathExists(componentsJsonPath(cwd));
}
