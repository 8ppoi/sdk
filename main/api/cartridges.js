import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

export const cartridges = new Hono();

// ローカルにリポジトリを作る
cartridges.get("/init/:vendorId/:cartridgeId/:username?", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const username = c.req.param("username");
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
    `https://${
      username ?? vendorId
    }@github.com/${vendorId}/8ppoi-cartridge-${cartridgeId}.git`,
  ], { cwd: dir });

  return c.html("✅ ローカルにリポジトリを作りました\n");
});

// リモートにリポジトリを作る
cartridges.get("/put/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");

  // GitHub に POST
  await Gh.fetch("user/repos", {
    username: vendorId,
    method: "POST",
    body: { name: `8ppoi-cartridge-${cartridgeId}` },
  });

  return c.html("✅ リモートにリポジトリを作りました\n");
});

// ローカルからリモートに push する
cartridges.get("/push/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // リモートリポジトリへ push
  command(["git", "add", "-A"], { cwd: dir });
  command(["git", "commit", "--allow-empty-message", "-m", ""], { cwd: dir });
  command(["git", "push", "-u", "origin", "main"], { cwd: dir });

  return c.html("✅ ローカルからリモートに push しました\n");
});

// リモートからローカルに clone する
cartridges.get("/clone/:vendorId/:cartridgeId/:username?", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const username = c.req.param("username");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // GitHub から clone
  command([
    "git",
    "clone",
    `https://${
      username ?? vendorId
    }@github.com/${vendorId}/8ppoi-cartridge-${cartridgeId}.git`,
    dir,
  ]);
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../../../.credentials",
  ], { cwd: dir });

  return c.html("✅ リモートからローカルに clone しました\n");
});

// リモートからローカルに pull する
cartridges.get("/pull/:vendorId/:cartridgeId", (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });

  return c.html("✅ リモートからローカルに pull しました\n");
});

// リモートのリポジトリを削除する
cartridges.get("/delete/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");

  // リモートのリポジトリを削除
  await Gh.fetch(`repos/${vendorId}/8ppoi-cartridge-${cartridgeId}`, {
    username: vendorId,
    method: "DELETE",
  });

  return c.html("✅ リモートのリポジトリを削除しました\n");
});

// ローカルのリポジトリを削除する
cartridges.get("/remove/:vendorId/:cartridgeId", (c) => {
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

  return c.html("✅ ローカルのリポジトリを削除しました\n");
});
