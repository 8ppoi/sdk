import { Hono } from "@hono/hono";
import { command } from "../command.js";
import { expandAllTags } from "./console/expandAllTags.js";

export const console = new Hono();

// リモートからローカルに clone する
console.get("/clone", (c) => {
  // GitHub から clone
  command([
    "git",
    "clone",
    `https://github.com/8ppoi/console.git`,
    dir,
  ]);

  return c.html("✅ リモートからローカルに clone しました\n");
});

// リモートからローカルに pull する
console.get("/pull", (c) => {
  const dir = "./consoles/main";

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });
expandAllTags();
  return c.html("✅ リモートからローカルに pull しました\n");
});
