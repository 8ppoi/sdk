import { Hono } from "@hono/hono";
import { vendor } from "./api/vendor.js";
import { cartridge } from "./api/cartridge.js";
import { scaffold } from "./api/scaffold.js";

export const api = new Hono();

api.route("/vendor/", vendor);
api.route("/cartridge/", cartridge);
api.route("/scaffold/", scaffold);
