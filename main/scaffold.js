import { Hono } from "@hono/hono";
import { vendor } from "./scaffold/vendor.js";
import { cartridge } from "./scaffold/cartridge.js";

export const scaffold = new Hono();

scaffold.route("/vendor/", vendor);
scaffold.route("/cartridge/", cartridge);
