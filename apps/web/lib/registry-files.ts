import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..", "..");

export type RegistryFileSpec = {
  /** Path on disk, relative to the monorepo root. */
  source: string;
  /** Path the user should create in their project. */
  dest: string;
  /** Language tag for the code block (tsx, ts, sql, json, etc). */
  language: string;
  /** Optional post-read transform — use to rewrite monorepo-internal imports to user-facing paths. */
  transform?: (content: string) => string;
};

export type RegistryFile = {
  source: string;
  dest: string;
  language: string;
  content: string;
};

export async function loadRegistryFiles(specs: RegistryFileSpec[]): Promise<RegistryFile[]> {
  return Promise.all(
    specs.map(async (spec) => {
      const abs = path.resolve(ROOT, spec.source);
      if (!abs.startsWith(ROOT + path.sep)) {
        throw new Error(`registry file outside monorepo: ${spec.source}`);
      }
      const raw = await readFile(abs, "utf8");
      const content = spec.transform ? spec.transform(raw) : raw;
      return { source: spec.source, dest: spec.dest, language: spec.language, content };
    }),
  );
}

export const TODAY_ACTIVITY_CARD_FILES: RegistryFileSpec[] = [
  {
    source: "packages/registry/components/today-activity-card/index.tsx",
    dest: "components/wristkit/today-activity-card/index.tsx",
    language: "tsx",
  },
  {
    source: "packages/registry/components/today-activity-card/states.tsx",
    dest: "components/wristkit/today-activity-card/states.tsx",
    language: "tsx",
  },
  {
    source: "packages/registry/components/today-activity-card/load.ts",
    dest: "components/wristkit/today-activity-card/load.ts",
    language: "ts",
    // The monorepo source imports from the local shim "./queries"; rewrite to
    // the path the user will actually have in their project.
    transform: (c) => c.replace(/from "\.\/queries"/, 'from "@/lib/wristkit/queries"'),
  },
  {
    source: "packages/registry/lib/queries.ts",
    dest: "lib/wristkit/queries.ts",
    language: "ts",
  },
  {
    source: "packages/registry/lib/db.ts",
    dest: "lib/wristkit/db.ts",
    language: "ts",
  },
  {
    source: "packages/registry/lib/schema.ts",
    dest: "lib/wristkit/schema.ts",
    language: "ts",
  },
  {
    source: "packages/registry/lib/validation.ts",
    dest: "lib/wristkit/validation.ts",
    language: "ts",
  },
];

export const HANDLER_FILES: RegistryFileSpec[] = [
  {
    source: "packages/registry/handlers/wristkit-sync-handler/route.ts",
    dest: "app/api/wristkit-sync/route.ts",
    language: "ts",
  },
];
