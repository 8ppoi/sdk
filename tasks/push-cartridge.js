import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

const cartridgeId = Deno.args[0];

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// カートリッジディレクトリへ移動
Deno.chdir(`./vendors/${Gh.login}/cartridges/${cartridgeId}`);

// リモートリポジトリへ push
try {
  command(["git", "add", "-A"]);
  command(["git", "commit", "--allow-empty-message", "-m", ""]);
  command(["git", "push"]);
} catch (e) {
  console.log(e);
}
