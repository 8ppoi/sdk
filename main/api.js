import { Hono } from "@hono/hono";
import { Consoles } from "./api/Consoles.js";
import { Vendors } from "./api/Vendors.js";
import { Cartridges } from "./api/Cartridges.js";
import { scaffold } from "./api/scaffold.js";

export const api = new Hono();

api.all("/consoles/clone", (c) => Consoles.clone(c));
api.all("/consoles/pull", (c) => Consoles.pull(c));

api.all("/vendors/init/:vendorId/:username?", (c) => Vendors.init(c));
api.all("/vendors/put/:vendorId", async (c) => Vendors.put(c));
api.all("/vendors/push/:vendorId", (c) => Vendors.push(c));
api.all("/vendors/clone/:vendorId/:username?", (c) => Vendors.clone(c));
api.all("/vendors/pull/:vendorId", (c) => Vendors.pull(c));
api.all("/vendors/delete/:vendorId", async (c) => Vendors.delete(c));
api.all("/vendors/remove/:vendorId", (c) => Vendors.remove(c));

api.all("/cartridges/init/:vendorId/:cartridgeId/:username?", (c) => Cartridges.init(c));
api.all("/cartridges/put/:vendorId/:cartridgeId", async (c) => Cartridges.put(c));
api.all("/cartridges/push/:vendorId/:cartridgeId", (c) => Cartridges.push(c));
api.all("/cartridges/clone/:vendorId/:cartridgeId/:username?", (c) => Cartridges.clone(c));
api.all("/cartridges/pull/:vendorId/:cartridgeId", (c) => Cartridges.pull(c));
api.all("/cartridges/delete/:vendorId/:cartridgeId", async (c) => Cartridges.delete(c));
api.all("/cartridges/remove/:vendorId/:cartridgeId", (c) => Cartridges.remove(c));

api.all("/scaffold/vendor", (c) => Scaffold.vendor(c));
api.all("/scaffold/cartridge", (c) => Scaffold.cartridge(c));
