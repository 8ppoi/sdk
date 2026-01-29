const vendorId = Deno.args[0];
const cartridgeId = Deno.args[1];

// カートリッジディレクトリを削除
Deno.removeSync(`./vendors/${vendorId}/cartridges/${cartridgeId}`, {
  recursive: true,
});
