import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

export const cartridge = new Hono();

// ローカルにリポジトリを作る
cartridge.get("/init/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // ディレクトリを作成
  Deno.mkdirSync(dir, { recursive: true });

  // ローカルリポジトリ設定
  command(["git", "init", "-b", "main"], { cwd: dir });
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../../../.credentials",
  ], { cwd: dir });
  command(
    ["git", "commit", "--allow-empty", "--allow-empty-message", "-m", ""],
    { cwd: dir },
  );
  command([
    "git",
    "remote",
    "add",
    "origin",
    `https://${vendorId}@github.com/${vendorId}/8ppoi-cartridge-${cartridgeId}.git`,
  ], { cwd: dir });

  return c.html("✅ ローカルにリポジトリを作りました");
});

// リモートにリポジトリを作る
cartridge.get("/put/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // GitHub に POST
  await Gh.fetch("user/repos", {
    username: vendorId,
    method: "POST",
    body: { name: `8ppoi-cartridge-${cartridgeId}` },
  });

  return c.html("✅ リモートにリポジトリを作りました");
});

// ローカルからリモートに push する
cartridge.get("/push/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // リモートリポジトリへ push
  command(["git", "add", "-A"], { cwd: dir });
  command(["git", "commit", "--allow-empty-message", "-m", ""], { cwd: dir });
  command(["git", "push", "-u", "origin", "main"], { cwd: dir });

  return c.html("✅ ローカルからリモートに push しました");
});

// リモートからローカルに clone する
cartridge.get("/clone/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // GitHub から clone
  command([
    "git",
    "clone",
    `https://${vendorId}@github.com/${vendorId}/8ppoi-vendor.git`,
    dir,
  ]);
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../../../.credentials",
  ], { cwd: dir });

  return c.html("✅ リモートからローカルに clone しました");
});

// リモートからローカルに pull する
cartridge.get("/pull/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });

  return c.html("✅ リモートからローカルに pull しました");
});

// リモートのリポジトリを削除する
cartridge.get("/delete/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // リモートのリポジトリを削除
  await Gh.fetch(`repos/${vendorId}/8ppoi-cartridge-${cartridgeId}`, {
    username: vendorId,
    method: "DELETE",
  });

  return c.html("✅ リモートのリポジトリを削除しました");
});

// ローカルのリポジトリを削除する
cartridge.get("/remove/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // ディレクトリを削除
  Deno.removeSync(dir, { recursive: true });
  try {
    Deno.removeSync(dirname(dir));
  } catch {
    //
  }

  return c.html("✅ ローカルのリポジトリを削除しました");
});

/*
// ローカルリポジトリをスキャフォールドする
cartridge.get("/scaffold/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

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
*/
