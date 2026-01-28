import { Gh } from "./util/Gh.js";

const cartridgeId = Deno.args[0];

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// リモートリポジトリを削除
await Gh.fetch(`repos/${Gh.login}/8ppoi-cartridge-${cartridgeId}`, "DELETE");
