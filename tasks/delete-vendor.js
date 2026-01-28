import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// ベンダーディレクトリを削除
Deno.removeSync(`./vendors/${Gh.login}`, { recursive: true });

// リモートリポジトリを削除
await Gh.fetch(`repos/${Gh.login}/8ppoi-vendor`, "DELETE");
