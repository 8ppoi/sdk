import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { command } from "../command.js";
import { expandAllTags } from "./console/expandAllTags.js";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

export const console = new Hono();

// リモートからローカルに clone する
console.get("/clone", (c) => {
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
});

// リモートからローカルに pull する
console.get("/pull", (c) => {
  const dir = `${currentFileDir}/../../consoles/main`;

  const results = [];

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });
  results.push(expandAllTags());

  results.push("✅ リモートからローカルに pull しました\n");
  return c.html(results.join(""));
});
