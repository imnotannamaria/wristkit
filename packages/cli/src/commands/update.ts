import kleur from "kleur";
import { addCommand } from "./add.js";

export async function updateCommand(name?: string) {
  if (!name) {
    console.log(
      kleur.yellow("wristkit update: pass an item name for now (e.g. today-activity-card)."),
    );
    return;
  }

  // v1: update behaves like add (diff prompt happens on overwrite)
  await addCommand(name);
}
