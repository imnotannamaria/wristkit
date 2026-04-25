import { z } from "zod";

const RegistryItemSchema = z.object({
  name: z.string(),
  type: z.enum(["component", "handler", "schema", "shortcut", "lib"]),
  version: z.string(),
  description: z.string(),
  dependencies: z
    .object({
      npm: z.array(z.string()).optional(),
      registry: z.array(z.string()).optional(),
    })
    .optional(),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      overwrite: z.boolean().optional(),
    }),
  ),
  metrics: z.array(z.string()).optional(),
  postInstall: z
    .object({
      message: z.string().optional(),
      sql: z.array(z.string()).optional(),
    })
    .optional(),
});

export type RegistryItem = z.infer<typeof RegistryItemSchema>;

export async function fetchRegistryItem(params: {
  registryBaseUrl: string;
  name: string;
}): Promise<RegistryItem> {
  const url = `${params.registryBaseUrl.replace(/\/$/, "")}/${params.name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry item: ${params.name} (${res.status})`);
  }
  const json = (await res.json()) as unknown;
  return RegistryItemSchema.parse(json);
}
