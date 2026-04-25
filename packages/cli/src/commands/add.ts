import path from "node:path";
import kleur from "kleur";
import prompts from "prompts";
import { type RegistryItem, fetchRegistryItem } from "../registry/fetch.js";
import { readComponentsJson } from "../utils/components-json.js";
import { unifiedDiff } from "../utils/diff.js";
import { run } from "../utils/exec.js";
import { pathExists, readText, writeText } from "../utils/fs.js";
import { detectPackageManager } from "../utils/pm.js";

async function installNpmDeps(cwd: string, deps: string[]) {
  if (!deps.length) return;
  const pm = await detectPackageManager(cwd);
  const args =
    pm === "pnpm" ? ["add", ...deps] : pm === "yarn" ? ["add", ...deps] : ["install", ...deps];
  await run(pm, args, cwd);
}

function resolveDestPath(
  cwd: string,
  filePath: string,
  mapping: { components: string; lib: string },
) {
  if (filePath.startsWith("components/")) {
    return path.join(cwd, mapping.components, filePath.slice("components/".length));
  }
  if (filePath.startsWith("lib/")) {
    return path.join(cwd, mapping.lib, filePath.slice("lib/".length));
  }
  return path.join(cwd, filePath);
}

async function writeFileWithPrompt(params: {
  cwd: string;
  dest: string;
  content: string;
  overwrite?: boolean;
}) {
  const exists = await pathExists(params.dest);
  if (!exists) {
    await writeText(params.dest, params.content);
    return;
  }

  if (params.overwrite) {
    await writeText(params.dest, params.content);
    return;
  }

  const current = await readText(params.dest);
  if (current === params.content) return;

  const diff = unifiedDiff({
    fromPath: params.dest,
    toPath: params.dest,
    fromContent: current,
    toContent: params.content,
  });

  const answer = await prompts({
    type: "select",
    name: "action",
    message: `File exists: ${path.relative(params.cwd, params.dest)}. Overwrite?`,
    choices: [
      { title: "no", value: "no" },
      { title: "yes", value: "yes" },
      { title: "diff", value: "diff" },
    ],
    initial: 0,
  });

  if (answer.action === "diff") {
    console.log(diff);
    const again = await prompts({
      type: "confirm",
      name: "ok",
      message: "Overwrite after seeing diff?",
      initial: false,
    });
    if (again.ok) await writeText(params.dest, params.content);
    return;
  }

  if (answer.action === "yes") {
    await writeText(params.dest, params.content);
  }
}

async function resolveRegistryDeps(params: {
  registryBaseUrl: string;
  root: RegistryItem;
}): Promise<RegistryItem[]> {
  const out: RegistryItem[] = [];
  const seen = new Set<string>();

  async function visit(name: string) {
    if (seen.has(name)) return;
    seen.add(name);
    const item =
      name === params.root.name
        ? params.root
        : await fetchRegistryItem({ registryBaseUrl: params.registryBaseUrl, name });
    const deps = item.dependencies?.registry ?? [];
    for (const d of deps) await visit(d);
    out.push(item);
  }

  await visit(params.root.name);
  return out;
}

export async function addCommand(name: string) {
  const cwd = process.cwd();
  const cfg = await readComponentsJson(cwd).catch(() => null);
  if (!cfg) {
    console.error(kleur.red("wristkit: components.json not found. Run `wristkit init` first."));
    process.exitCode = 1;
    return;
  }

  const registryBaseUrl = cfg.wristkit.registry;
  const root = await fetchRegistryItem({ registryBaseUrl, name });
  const items = await resolveRegistryDeps({ registryBaseUrl, root });

  // Install npm deps
  const npmDeps = Array.from(new Set(items.flatMap((i) => i.dependencies?.npm ?? [])));
  await installNpmDeps(cwd, npmDeps);

  for (const item of items) {
    for (const f of item.files) {
      const dest = resolveDestPath(cwd, f.path, {
        components: cfg.wristkit.paths.components,
        lib: cfg.wristkit.paths.lib,
      });
      await writeFileWithPrompt({ cwd, dest, content: f.content, overwrite: f.overwrite });
    }

    if (item.postInstall?.message) {
      console.log(kleur.green(item.postInstall.message));
    }
  }

  console.log(kleur.green(`Installed: ${name}`));
}
