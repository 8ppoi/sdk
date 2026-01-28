import { Hono } from "@hono/hono";
import { render } from "renderer";
import { getIds, getVendor, getVendorCartridges } from "./vendors.js";

function getVendorNames() {
  const vendorIds = getIds("./vendors");
  return Object.fromEntries(
    vendorIds.sort().map((vendorId) => getVendor(vendorId)).map((
      { id, name },
    ) => [id, name]),
  );
}

export function getCartridges() {
  const vendorIds = getIds("./vendors");
  return vendorIds.sort().map((vendorId) => getVendorCartridges(vendorId))
    .flat();
}

export const cartridges = new Hono();

cartridges.get("/", (c) => {
  return c.html(render("./main/layouts/default.html", {
    templatePath: "../templates/cartridges.html",
    _: {
      vendorNames: getVendorNames(),
      cartridges: getCartridges(),
    },
  }));
});
