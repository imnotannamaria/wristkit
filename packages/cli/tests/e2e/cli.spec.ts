import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("prompts", () => {
  return {
    default: vi.fn(async () => ({
      theme: "violet",
      componentsDir: "components/wristkit",
      libDir: "lib/wristkit",
      handlerPath: "app/api/healthkit/route.ts",
    })),
  };
});

vi.mock("../../src/utils/exec", () => {
  return {
    run: vi.fn(async () => {}),
  };
});

import { addCommand } from "../../src/commands/add";
import { initCommand } from "../../src/commands/init";

type Server = {
  url: string;
  close: () => Promise<void>;
};

async function startRegistryServer(items: Record<string, unknown>): Promise<Server> {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url ?? "/", "http://localhost");
    const m = u.pathname.match(/^\/r\/(.+)\.json$/);
    if (!m) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }

    const name = m[1];
    if (!name) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }

    const item = items[name];
    if (!item) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(item));
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("failed to bind");

  return {
    url: `http://127.0.0.1:${addr.port}/r`,
    close: async () => {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
    },
  };
}

async function writeJson(p: string, v: unknown) {
  await writeFile(p, `${JSON.stringify(v, null, 2)}\n`, "utf8");
}

describe("wristkit CLI (phase 2)", () => {
  let dir: string;
  let registry: Server;

  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "wristkit-cli-"));

    // Minimal Next App Router fixture
    await mkdir(path.join(dir, "app"), { recursive: true });
    await writeJson(path.join(dir, "package.json"), {
      name: "fixture",
      private: true,
      dependencies: { next: "16.2.4", react: "19.2.5", "react-dom": "19.2.5" },
    });

    registry = await startRegistryServer({
      "today-activity-card": {
        name: "today-activity-card",
        type: "component",
        version: "0.0.0",
        description: "test",
        dependencies: { npm: [], registry: [] },
        files: [
          {
            path: "components/today-activity-card.tsx",
            content: "export const X = 1;\n",
            overwrite: false,
          },
        ],
      },
    });
  });

  afterAll(async () => {
    await registry.close();
  });

  it("init writes components.json and env example", async () => {
    const prev = process.cwd();
    process.chdir(dir);
    try {
      await initCommand();
      const componentsJson = JSON.parse(await readFile(path.join(dir, "components.json"), "utf8"));
      expect(componentsJson.wristkit.paths.components).toBe("components/wristkit");

      const envExample = await readFile(path.join(dir, ".env.local.example"), "utf8");
      expect(envExample).toContain("WRISTKIT_DATABASE_URL");
      expect(envExample).toContain("WRISTKIT_API_KEY");
    } finally {
      process.chdir(prev);
    }
  });

  it("add installs registry item into configured paths", async () => {
    const prev = process.cwd();
    process.chdir(dir);
    try {
      // Override registry to point at the local server
      const componentsJsonPath = path.join(dir, "components.json");
      const cfg = JSON.parse(await readFile(componentsJsonPath, "utf8"));
      cfg.wristkit.registry = registry.url;
      await writeJson(componentsJsonPath, cfg);

      await addCommand("today-activity-card");

      const installed = await readFile(
        path.join(dir, "components", "wristkit", "today-activity-card.tsx"),
        "utf8",
      );
      expect(installed).toContain("export const X = 1;");
    } finally {
      process.chdir(prev);
    }
  });
});
