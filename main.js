import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { render } from "renderer";
import { vendors } from "./main/vendors.js";
import { cartridges } from "./main/cartridges.js";

const app = new Hono();

app.get("/", (c) =>
  c.html(render("./main/layouts/default.html", {
    templatePath: "../templates/index.html",
  })));

app.route("/vendors/", vendors);
app.route("/cartridges/", cartridges);

app.get("/consoles/*", serveStatic({ root: "." }));
app.get("/vendors/*", serveStatic({ root: "." }));
app.get("/static/*", serveStatic({ root: "." }));

Deno.serve(app.fetch);
