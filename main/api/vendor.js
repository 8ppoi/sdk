import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

export const vendor = new Hono();

// ローカルにリポジトリを作る
vendor.get("/init", async (c) => {
  const vendorId = Gh.user.login;
  const dir = `./vendors/${vendorId}`;

  // ベンダーディレクトリを作成
  Deno.mkdirSync(`./vendors/${vendorId}`, { recursive: true });

  // .gitignore を作成
  Deno.writeTextFileSync(`./vendors/${vendorId}/.gitignore`, "/cartridges\n");

  // アバターを GitHub から取得
  const resp = await fetch(Gh.user.avatar_url);
  const buffer = await resp.arrayBuffer();
  Deno.writeFileSync(`./vendors/${vendorId}/avatar`, new Uint8Array(buffer));

  // meta.json を作成
  Deno.writeTextFileSync(`./vendors/${vendorId}/meta.json`, `{
    "name": "${vendorId}",
    "avatar": "avatar",
    "description": "私の名前は ${vendorId} です。"
  }`);

  // ローカルリポジトリ設定
  command(["git", "init"], { cwd: dir });
  command(["git", "remote", "add", "origin", `https://github.com/${vendorId}/8ppoi-vendor.git`], { cwd: dir });
  command(["git", "add", "-A"], { cwd: dir });
  command(["git", "commit", "--allow-empty-message", "-m", ""], { cwd: dir });

  return c.html("✅ ローカルにリポジトリを作りました");
});

// リモートにリポジトリを作る
vendor.get("/put", (c) => {
  const vendorId = Gh.user.login;

  return c.html(c.req.path);
});

// ローカルからリモートに push する
vendor.get("/push", (c) => {
  const vendorId = Gh.user.login;

  return c.html(c.req.path);
});

// リモートからローカルに clone する
vendor.get("/clone/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");

  return c.html(c.req.path + " " + vendorId);
});

// リモートからローカルに pull する
vendor.get("/pull/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");

  return c.html(c.req.path + " " + vendorId);
});

// ローカルのリポジトリを削除する
vendor.get("/remove/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // ベンダーディレクトリを削除
  Deno.removeSync(`./vendors/${vendorId}`, { recursive: true });

  return c.html("✅ ローカルのリポジトリを削除しました");
});

// リモートのリポジトリを削除する
vendor.get("/delete", (c) => {
  const vendorId = Gh.user.login;

  return c.html(c.req.path);
});
