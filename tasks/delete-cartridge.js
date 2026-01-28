import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

const cartridgeId = Deno.args[0];

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// カートリッジディレクトリを削除
Deno.removeSync(`./vendors/${Gh.login}/cartridges/${cartridgeId}`, { recursive: true });

// リモートリポジトリを削除
await Gh.fetch(`repos/${Gh.login}/8ppoi-cartridge-${cartridgeId}`, "DELETE");
