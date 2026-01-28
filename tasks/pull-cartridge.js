import { command } from "./util/command.js";

const vendorId = Deno.args[0];
const cartridgeId = Deno.args[1];

// GitHub から pull
Deno.chdir(`./vendors/${vendorId}/cartridges/${cartridgeId}`);
command(["git", "pull"]);
