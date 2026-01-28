import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// GitHub ユーザ情報を取得
const user = await Gh.fetch("user");

// ベンダーディレクトリを作成
Deno.mkdirSync(`./vendors/${user.login}`, { recursive: true });

// .gitignoreを作成
Deno.writeTextFileSync(`./vendors/${user.login}/.gitignore`, "/cartridges\n");

// アバターをGitHubから取得
const resp = await fetch(user.avatar_url);
const buffer = await resp.arrayBuffer();
Deno.writeFileSync(`./vendors/${user.login}/avatar`, new Uint8Array(buffer));

// meta.jsonを作成
Deno.writeTextFileSync(`./vendors/${user.login}/meta.json`, `{
  "name": "${user.login}",
  "avatar": "avatar",
  "description": "私の名前は ${user.login} です。"
}`);

// ローカルリポジトリ設定
Deno.chdir(`./vendors/${user.login}`);
command(["git", "init"]);
command(["git", "remote", "add", "origin", `https://github.com/${user.login}/8ppoi-vendor.git`]);
command(["git", "add", "-A"]);
command(["git", "commit", "--allow-empty-message", "-m", ""]);

// GitHub にプッシュ
await Gh.fetch("user/repos", "POST", { name: "8ppoi-vendor" });
command(["git", "config", "credential.helper", "store --file=../../.credentials"]);
command(["git", "push", "-u", "origin", "main"]);
