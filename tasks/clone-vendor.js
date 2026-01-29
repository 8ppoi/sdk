import { command } from "./util/command.js";

const vendorId = Deno.args[0];

// GitHub から clone
command([
  "git",
  "clone",
  `https://github.com/${vendorId}/8ppoi-vendor.git`,
  `./vendors/${vendorId}`,
]);
