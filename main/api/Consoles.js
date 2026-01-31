import { dirname } from "@std/path";
import { command } from "../command.js";
import { expandAllTags } from "./consoles/expandAllTags.js";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

export class Consoles {
  // リモートからローカルに clone する
  static clone(c) {
    const dir = `${currentFileDir}/../../consoles/main`;

    const results = [];

    // GitHub から clone
    command([
      "git",
      "clone",
      `https://github.com/8ppoi/console.git`,
      dir,
    ]);
    results.push(expandAllTags());

    results.push("✅ リモートからローカルに clone しました\n");
    return c.html(results.join(""));
  }

  // リモートからローカルに pull する
  static pull(c) {
    const dir = `${currentFileDir}/../../consoles/main`;

    const results = [];

    // GitHub から pull
    command(["git", "pull", "--tags"], { cwd: dir });
    results.push(expandAllTags());

    results.push("✅ リモートからローカルに pull しました\n");
    return c.html(results.join(""));
  }
}
