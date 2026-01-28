import { command } from "./util/command.js";

const vendorId = Deno.args[0];

// GitHub から pull
Deno.chdir(`./vendors/${vendorId}`);
command(["git", "pull"]);
