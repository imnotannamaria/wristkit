import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { shortcutCommand } from "./commands/shortcut.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

const pkgJsonPath = join(dirname(fileURLToPath(import.meta.url)), "../package.json");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as {
  name?: string;
  version?: string;
  description?: string;
};

program
  .name(pkg.name ?? "wristkit")
  .description(pkg.description ?? "Apple Health on the web")
  .version(pkg.version ?? "0.0.0");

program.command("init").description("Set up wristkit in this project").action(initCommand);

program.command("add <name>").description("Add a registry item").action(addCommand);

program.command("update [name]").description("Update installed items").action(updateCommand);

program.command("shortcut").description("iOS Shortcut setup").action(shortcutCommand);

program.parse();
