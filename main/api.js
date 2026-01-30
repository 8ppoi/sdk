import { Hono } from "@hono/hono";
import { console } from "./api/console.js";
import { vendor } from "./api/vendor.js";
import { cartridge } from "./api/cartridge.js";
import { scaffold } from "./api/scaffold.js";

export const api = new Hono();

api.route("/console/", console);
api.route("/vendor/", vendor);
api.route("/cartridge/", cartridge);
api.route("/scaffold/", scaffold);
