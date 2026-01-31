import { Hono } from "@hono/hono";
import { Consoles } from "./api/Consoles.js";
import { Vendors } from "./api/Vendors.js";
import { Cartridges } from "./api/Cartridges.js";
import { scaffold } from "./api/scaffold.js";

export const api = new Hono();

api.get("/consoles/clone", (c) => Consoles.clone(c));
api.get("/consoles/pull", (c) => Consoles.pull(c));

api.get("/vendors/init/:vendorId/:username?", (c) => Vendors.init(c));
api.get("/vendors/put/:vendorId", (c) => await Vendors.put(c));
api.get("/vendors/push/:vendorId", (c) => Vendors.push(c));
api.get("/vendors/clone/:vendorId/:username?", (c) => Vendors.clone(c));
api.get("/vendors/pull/:vendorId", (c) => Vendors.pull(c));
api.get("/vendors/delete/:vendorId", (c) => await Vendors.delete(c));
api.get("/vendors/remove/:vendorId", (c) => Vendors.remove(c));

api.get("/cartridges/init/:vendorId/:cartridgeId/:username?", (c) => Cartridges.init(c));
api.get("/cartridges/put/:vendorId/:cartridgeId", (c) => await Cartridges.put(c));
api.get("/cartridges/push/:vendorId/:cartridgeId", (c) => Cartridges.push(c));
api.get("/cartridges/clone/:vendorId/:cartridgeId/:username?", (c) => Cartridges.clone(c));
api.get("/cartridges/pull/:vendorId/:cartridgeId", (c) => Cartridges.pull(c));
api.get("/cartridges/delete/:vendorId/:cartridgeId", (c) => await Cartridges.delete(c));
api.get("/cartridges/remove/:vendorId/:cartridgeId", (c) => Cartridges.remove(c));
