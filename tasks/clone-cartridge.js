import { command } from "./util/command.js";

const vendorId = Deno.args[0];
const cartridgeId = Deno.args[1];

// GitHub から clone
command([
  "git", 
  "clone", 
  `https://github.com/${vendorId}/8ppoi-cartridge-${cartridgeId}.git`, 
  `./vendors/${vendorId}/cartridges/${cartridgeId}`
]);
