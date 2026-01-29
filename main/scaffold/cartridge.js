import { Hono } from "@hono/hono";
import { Gh } from "../Gh.js";

export const cartridge = new Hono();

// ローカルリポジトリをスキャフォールドする
cartridge.get("/:vendorId/:cartridgeId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const cartridgeId = c.req.param("cartridgeId");
  const dir = `./vendors/${vendorId}/cartridges/${cartridgeId}`;
/*
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
*/
  return c.html("✅ ローカルリポジトリをスキャフォールドしました");
});
