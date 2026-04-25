import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function readText(p: string): Promise<string> {
  return await readFile(p, "utf8");
}

export async function readJson<T>(p: string): Promise<T> {
  return JSON.parse(await readText(p)) as T;
}

export async function writeText(p: string, content: string): Promise<void> {
  await ensureDir(path.dirname(p));
  await writeFile(p, content, "utf8");
}

export async function writeJson(p: string, value: unknown): Promise<void> {
  await writeText(p, `${JSON.stringify(value, null, 2)}\n`);
}
