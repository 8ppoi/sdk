import { dirname } from "@std/path";
import { command } from "../command.js";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

export class Sdk {
  // リモートからローカルに pull する
  static pull(c) {
    const dir = `${currentFileDir}/../..`;

    const results = [];

    // GitHub から pull
    command(["git", "pull"], { cwd: dir });

    results.push("✅ リモートからローカルに pull しました\n");
    return c.html(results.join(""));
  }
}
