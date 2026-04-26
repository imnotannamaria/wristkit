import path from "node:path";
import kleur from "kleur";
import prompts from "prompts";
import { detectNextProject } from "../detectors/next.js";
import { writeComponentsJson } from "../utils/components-json.js";
import { run } from "../utils/exec.js";
import { ensureDir, pathExists, writeText } from "../utils/fs.js";
import { detectPackageManager } from "../utils/pm.js";

export async function initCommand() {
  const cwd = process.cwd();

  const detected = await detectNextProject(cwd);
  if (!detected.ok) {
    console.error(kleur.red("wristkit: Next.js App Router project required (v1)."));
    process.exitCode = 1;
    return;
  }

  const defaultComponents = "components/wristkit";
  const defaultLib = "lib/wristkit";
  const defaultHandler = path.join(detected.appDir ?? "app", "api", "healthkit", "route.ts");

  const response = await prompts(
    [
      {
        type: "select",
        name: "theme",
        message: "Theme",
        choices: [
          { title: "default", value: "default" },
          { title: "neutral", value: "neutral" },
          { title: "violet", value: "violet" },
          { title: "custom", value: "custom" },
        ],
        initial: 2,
      },
      {
        type: "text",
        name: "componentsDir",
        message: "Components directory",
        initial: defaultComponents,
      },
      {
        type: "text",
        name: "libDir",
        message: "Lib directory",
        initial: defaultLib,
      },
      {
        type: "text",
        name: "handlerPath",
        message: "API route path",
        initial: defaultHandler,
      },
    ],
    {
      onCancel: () => {
        process.exitCode = 1;
        return false;
      },
    },
  );

  await writeComponentsJson(cwd, {
    $schema: "https://wristkit-web.vercel.app/schema.json",
    wristkit: {
      version: 1,
      registry: "https://wristkit-web.vercel.app/r",
      theme: response.theme as string,
      paths: {
        components: response.componentsDir as string,
        lib: response.libDir as string,
        handler: response.handlerPath as string,
      },
    },
  });

  const envExamplePath = path.join(cwd, ".env.local.example");
  if (!(await pathExists(envExamplePath))) {
    await writeText(
      envExamplePath,
      ["WRISTKIT_DATABASE_URL=postgres://...", "WRISTKIT_API_KEY=your-secret-api-key", ""].join(
        "\n",
      ),
    );
  }

  await ensureDir(path.join(cwd, response.componentsDir as string));
  await ensureDir(path.join(cwd, response.libDir as string));

  const pm = await detectPackageManager(cwd);
  const installCmd = pm;
  const installArgs =
    pm === "pnpm"
      ? ["add", "drizzle-orm", "postgres", "zod", "framer-motion"]
      : pm === "yarn"
        ? ["add", "drizzle-orm", "postgres", "zod", "framer-motion"]
        : ["install", "drizzle-orm", "postgres", "zod", "framer-motion"];

  // Only install if not already present (best-effort).
  const pkgJsonPath = path.join(cwd, "package.json");
  if (await pathExists(pkgJsonPath)) {
    await run(installCmd, installArgs, cwd).catch(() => {
      console.warn(kleur.yellow("wristkit: could not auto-install deps; please install manually."));
    });
  }

  console.log(
    [
      kleur.green("wristkit initialized."),
      "",
      "Next steps:",
      "- Run the SQL migration in Supabase (see packages/registry/schemas/0001_initial.sql)",
      "- Download the iOS Shortcut: https://wristkit-web.vercel.app/shortcut",
      "- Add the component: npx wristkit add today-activity-card",
    ].join("\n"),
  );
}
