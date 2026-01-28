import { Hono } from "@hono/hono";
import { vendor } from "./api/vendor.js";

export const api = new Hono();

api.route("/vendor/", vendor);
