import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// GitHub にプッシュ
await Gh.fetch("user/repos", "POST", {
  name: `8ppoi-cartridge-${cartridgeId}`,
});
command([
  "git",
  "config",
  "credential.helper",
  "store --file=../../../../.credentials",
]);
command(["git", "push", "-u", "origin", "main"]);
