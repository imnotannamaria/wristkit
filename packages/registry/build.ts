import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type RegistryItemType = "component" | "handler" | "schema" | "shortcut" | "lib";

type RegistryItemSource = {
  name: string;
  type: RegistryItemType;
  version: string;
  description: string;
  dependencies?: {
    npm?: string[];
    registry?: string[];
  };
  metrics?: string[];
  files: Array<{
    path: string;
    source: string;
    overwrite?: boolean;
  }>;
  postInstall?: {
    message?: string;
    sql?: string[];
  };
};

type RegistryItemBuilt = Omit<RegistryItemSource, "files"> & {
  files: Array<{
    path: string;
    content: string;
    overwrite?: boolean;
  }>;
};

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function discoverMetaFiles(registryRoot: string): Promise<string[]> {
  const candidates: string[] = [];
  const top = ["components", "handlers", "schemas", "shortcuts", "lib"];

  for (const dir of top) {
    const absTop = path.join(registryRoot, dir);
    if (!(await exists(absTop))) continue;

    // Some sections (schemas/shortcuts) may keep meta.json at the top-level.
    const topMeta = path.join(absTop, "meta.json");
    if (await exists(topMeta)) candidates.push(topMeta);

    const entries = await readdir(absTop, { withFileTypes: true }).catch(() => []);
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const meta = path.join(absTop, ent.name, "meta.json");
      if (await exists(meta)) candidates.push(meta);
    }
  }

  return candidates;
}

async function readJson<T>(p: string): Promise<T> {
  const txt = await readFile(p, "utf8");
  return JSON.parse(txt) as T;
}

async function buildItem(metaPath: string): Promise<RegistryItemBuilt> {
  const item = await readJson<RegistryItemSource>(metaPath);
  const baseDir = path.dirname(metaPath);

  const files = await Promise.all(
    item.files.map(async (f) => {
      const absSource = path.resolve(baseDir, f.source);
      const content = await readFile(absSource, "utf8");
      return { path: f.path, content, overwrite: f.overwrite };
    }),
  );

  return {
    name: item.name,
    type: item.type,
    version: item.version,
    description: item.description,
    dependencies: item.dependencies,
    metrics: item.metrics,
    postInstall: item.postInstall,
    files,
  };
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const registryRoot = path.join(repoRoot, "packages", "registry");
  const outDir = path.join(repoRoot, "apps", "web", "public", "r");

  await mkdir(outDir, { recursive: true });

  const metaFiles = await discoverMetaFiles(registryRoot);
  const built = await Promise.all(
    metaFiles.map(async (meta) => ({ meta, item: await buildItem(meta) })),
  );

  for (const { item } of built) {
    const outPath = path.join(outDir, `${item.name}.json`);
    await writeFile(outPath, `${JSON.stringify(item, null, 2)}\n`, "utf8");
  }

  console.log(`Built ${built.length} registry items into ${path.relative(repoRoot, outDir)}`);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
