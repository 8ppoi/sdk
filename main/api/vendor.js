import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";
import { command } from "../command.js";

export const vendor = new Hono();

// ローカルにリポジトリを作る
vendor.get("/init/:vendorId/:username?", (c) => {
  const vendorId = c.req.param("vendorId");
  const username = c.req.param("username");
  const dir = `./vendors/${vendorId}`;

  // ディレクトリを作成
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
  command([
    "git",
    "remote",
    "add",
    "origin",
    `https://${username ?? vendorId}@github.com/${vendorId}/8ppoi-vendor.git`,
  ], { cwd: dir });

  return c.html("✅ ローカルにリポジトリを作りました\n");
});

// リモートにリポジトリを作る
vendor.get("/put/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // GitHub に POST
  await Gh.fetch("user/repos", {
    username: vendorId,
    method: "POST",
    body: { name: "8ppoi-vendor" },
  });

  return c.html("✅ リモートにリポジトリを作りました\n");
});

// ローカルからリモートに push する
vendor.get("/push/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // リモートリポジトリへ push
  command(["git", "add", "-A"], { cwd: dir });
  command(["git", "commit", "--allow-empty-message", "-m", ""], { cwd: dir });
  command(["git", "push", "-u", "origin", "main"], { cwd: dir });

  return c.html("✅ ローカルからリモートに push しました\n");
});

// リモートからローカルに clone する
vendor.get("/clone/:vendorId/:username?", (c) => {
  const vendorId = c.req.param("vendorId");
  const username = c.req.param("username");
  const dir = `./vendors/${vendorId}`;

  // GitHub から clone
  command([
    "git",
    "clone",
    `https://${username ?? vendorId}@github.com/${vendorId}/8ppoi-vendor.git`,
    dir,
  ]);
  command([
    "git",
    "config",
    "credential.helper",
    "store --file=../../.credentials",
  ], { cwd: dir });

  return c.html("✅ リモートからローカルに clone しました\n");
});

// リモートからローカルに pull する
vendor.get("/pull/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // GitHub から pull
  command(["git", "pull"], { cwd: dir });

  return c.html("✅ リモートからローカルに pull しました\n");
});

// リモートのリポジトリを削除する
vendor.get("/delete/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");

  // リモートのリポジトリを削除
  await Gh.fetch(`repos/${vendorId}/8ppoi-vendor`, {
    username: vendorId,
    method: "DELETE",
  });

  return c.html("✅ リモートのリポジトリを削除しました\n");
});

// ローカルのリポジトリを削除する
vendor.get("/remove/:vendorId", (c) => {
  const vendorId = c.req.param("vendorId");
  const dir = `./vendors/${vendorId}`;

  // ディレクトリを削除
  Deno.removeSync(dir, { recursive: true });
  try {
    Deno.removeSync(dirname(dir));
  } catch {
    //
  }

  return c.html("✅ ローカルのリポジトリを削除しました\n");
});
