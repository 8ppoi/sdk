import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { render } from "renderer";
import { vendors } from "./main/vendors.js";
import { cartridges } from "./main/cartridges.js";
import { api } from "./main/api.js";
import { Gh } from "./main/Gh.js";

await Gh.init(Deno.readTextFileSync("./.credentials"));

const app = new Hono();

app.onError((err, c) => {
  console.error(err);
  return c.text("❌ " + err, 500);
});

app.get("/", (c) =>
  c.html(render("./main/layouts/default.html", {
    templatePath: "../templates/index.html",
  })));

app.route("/vendors/", vendors);
app.route("/cartridges/", cartridges);
app.route("/api/", api);

app.get("/consoles/*", serveStatic({ root: "." }));
app.get("/vendors/*", serveStatic({ root: "." }));
app.get("/static/*", serveStatic({ root: "." }));

Deno.serve(app.fetch);
