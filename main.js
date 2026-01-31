import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { render } from "renderer";
import { vendors, getVendor, getCartridge } from "./main/vendors.js";
import { cartridges } from "./main/cartridges.js";
import { Gh } from "./main/Gh.js";
import { api } from "./main/api.js";
import { respondImageWithMime } from "./utils.js";

await Gh.init(Deno.readTextFileSync("./.credentials"));

const app = new Hono();

app.onError((err, c) => {
  console.error(err);
  return c.text("❌ " + err.stack, 500);
});

app.get("/vendors/:vendorId/cartridges/:dartridgeId/artwork", respondImageWithMime);
app.get("/vendors/:vendorId/avatar", respondImageWithMime);

app.get("/", (c) => {
  const vendorId = "8ppoi";
  const cartridgeId = "invader-x";

  return c.html(render("./main/layouts/default.html", {
    templatePath: "../templates/index.html",
    _: {
      cartridge: getCartridge(vendorId, cartridgeId),
      vendor: getVendor(vendorId),
    },
  }));
});

app.route("/vendors/", vendors);
app.route("/cartridges/", cartridges);
app.route("/api/", api);

app.get("/consoles/*", serveStatic({ root: "." }));
app.get("/vendors/*", serveStatic({ root: "." }));
app.get("/static/*", serveStatic({ root: "." }));

Deno.serve(app.fetch);
