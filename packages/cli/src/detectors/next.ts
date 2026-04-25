import path from "node:path";
import { pathExists, readJson } from "../utils/fs.js";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function detectNextProject(cwd: string): Promise<{
  ok: boolean;
  nextVersion?: string;
  appDir?: string;
}> {
  const pkgPath = path.join(cwd, "package.json");
  if (!(await pathExists(pkgPath))) return { ok: false };

  const pkg = await readJson<PackageJson>(pkgPath);
  const nextVersion = pkg.dependencies?.next ?? pkg.devDependencies?.next;
  if (!nextVersion) return { ok: false };

  const appDir = (await pathExists(path.join(cwd, "app")))
    ? "app"
    : (await pathExists(path.join(cwd, "src", "app")))
      ? path.join("src", "app")
      : undefined;

  return { ok: Boolean(appDir), nextVersion, appDir };
}
