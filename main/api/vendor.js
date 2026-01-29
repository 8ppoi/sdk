import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

export const vendor = new Hono();

// ローカルリポジトリをスキャフォールドする
vendor.get("/scaffold/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // .gitignore を作成
  Deno.writeTextFileSync(`${dir}/.gitignore`, "/cartridges\n");

  // アバターを GitHub から取得
  const user = await Gh.fetch(`users/${vendorId}`, { username: vendorId });
  const resp = await fetch(user.avatar_url);
  const buffer = await resp.arrayBuffer();
  Deno.writeFileSync(`${dir}/avatar`, new Uint8Array(buffer));

  // meta.json を作成
  Deno.writeTextFileSync(
    `${dir}/meta.json`,
    `{
    "name": "${vendorId}",
    "avatar": "avatar",
    "description": "私の名前は ${vendorId} です。"
  }`,
  );

  return c.html("✅ ローカルリポジトリをスキャフォールドしました");
});

// ローカルにリポジトリを作る
vendor.get("/init/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // ベンダーディレクトリを作成
  Deno.mkdirSync(dir, { recursive: true });

  // ローカルリポジトリ設定
  command(["git", "init", "-b", "main"], { cwd: dir });
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../.credentials",
  ], { cwd: dir });
  command(
    ["git", "commit", "--allow-empty", "--allow-empty-message", "-m", ""],
    { cwd: dir },
  );

  return c.html("✅ ローカルにリポジトリを作りました");
});

// リモートにリポジトリを作る
vendor.get("/put/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");

  // GitHub に POST
  await Gh.fetch("user/repos", {
    username: vendorId,
    method: "POST",
    body: { name: "8ppoi-vendor" },
  });
  command([
    "git",
    "remote",
    "add",
    "origin",
    `https://${vendorId}@github.com/${vendorId}/8ppoi-vendor.git`,
  ], { cwd: dir });
  command(["git", "push", "-u", "origin", "main"], { cwd: dir });

  return c.html("✅ リモートにリポジトリを作りました");
});

// ローカルからリモートに push する
vendor.get("/push/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // リモートリポジトリへ push
  command(["git", "add", "-A"], { cwd: dir });
  command(["git", "commit", "--allow-empty-message", "-m", ""], { cwd: dir });
  command(["git", "push"], { cwd: dir });

  return c.html("✅ ローカルからリモートに push しました");
});

// リモートからローカルに clone する
vendor.get("/clone/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // GitHub から clone
  command([
    "git",
    "clone",
    `https://${vendorId}@github.com/${vendorId}/8ppoi-vendor.git`,
    dir,
  ]);

  return c.html("✅ リモートからローカルに clone しました");
});

// リモートからローカルに pull する
vendor.get("/pull/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../.credentials",
  ], { cwd: dir });

  return c.html("✅ リモートからローカルに pull しました");
});

// リモートのリポジトリを削除する
vendor.get("/delete/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");

  // リモートのリポジトリを削除
  await Gh.fetch(`repos/${vendorId}/8ppoi-vendor`, {
    username: vendorId,
    method: "DELETE",
  });

  return c.html("✅ リモートのリポジトリを削除しました");
});

// ローカルのリポジトリを削除する
vendor.get("/remove/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // ベンダーディレクトリを削除
  Deno.removeSync(dir, { recursive: true });

  return c.html("✅ ローカルのリポジトリを削除しました");
});
