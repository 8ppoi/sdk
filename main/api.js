import { Hono } from "@hono/hono";
import { consoles } from "./api/consoles.js";
import { vendors } from "./api/vendors.js";
import { cartridges } from "./api/cartridges.js";
import { scaffold } from "./api/scaffold.js";

export const api = new Hono();

api.route("/consoles/", consoles);
api.route("/vendors/", vendors);
api.route("/cartridges/", cartridges);
api.route("/scaffold/", scaffold);
