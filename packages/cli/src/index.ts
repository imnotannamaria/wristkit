import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { shortcutCommand } from "./commands/shortcut.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program.name("wristkit").description("Apple Health on the web").version("0.0.1");

program.command("init").description("Set up wristkit in this project").action(initCommand);

program.command("add <name>").description("Add a registry item").action(addCommand);

program.command("update [name]").description("Update installed items").action(updateCommand);

program.command("shortcut").description("iOS Shortcut setup").action(shortcutCommand);

program.parse();
