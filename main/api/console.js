import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

export const console = new Hono();

// リモートからローカルに clone する
vendor.get("/clone", (c) => {
  const dir = "./consoles/main";

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

  return c.html("✅ リモートからローカルに pull しました\n");
});
