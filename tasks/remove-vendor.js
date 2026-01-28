import { command } from "./util/command.js";

const vendorId = Deno.args[0];

// ベンダーディレクトリを削除
Deno.removeSync(`./vendors/${vendorId}`, { recursive: true });
