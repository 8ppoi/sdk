import { dirname } from "@std/path";
import { Hono } from "@hono/hono";
import { render } from "renderer";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

function readDir(path) {
  try {
    return Deno.readDirSync(path);
  } catch {
    return [];
  }
}

export function getIds(path) {
  return [
    ...readDir(`${currentFileDir}/../${path}`).filter((node) =>
      node.isDirectory
    ).map((node) => node.name),
  ];
}

function readTextFile(path) {
  return Deno.readTextFileSync(`${currentFileDir}/../${path}`);
}

function getVendors() {
  const vendorIds = getIds("./vendors");
  return vendorIds.sort().map((vendorId) => getVendor(vendorId));
}

export function getCartridge(vendorId, cartridgeId) {
  return Object.assign(
    { vendorId, id: cartridgeId },
    JSON.parse(
      readTextFile(
        `./vendors/${vendorId}/cartridges/${cartridgeId}/meta.json`,
      ),
    ),
  );
}

export function getVendor(vendorId) {
  return Object.assign(
    { id: vendorId },
    JSON.parse(
      readTextFile(
        `./vendors/${vendorId}/meta.json`,
      ),
    ),
  );
}

export function getVendorCartridges(vendorId) {
  const cartridgeIds = getIds(`./vendors/${vendorId}/cartridges`);
  return cartridgeIds.sort().map((cartridgeId) =>
    getCartridge(vendorId, cartridgeId)
  );
}

export const vendors = new Hono();

vendors.get("/", (c) =>
  c.html(render("./main/layouts/default.html", {
    templatePath: "../templates/vendors.html",
    _: {
      vendors: getVendors(),
    },
  })));

vendors.get(
  "/:vendorId/",
  (c) =>
    c.html(render("./main/layouts/default.html", {
      templatePath: "../templates/vendor.html",
      _: {
        vendor: getVendor(c.req.param("vendorId")),
        vendorCartridges: getVendorCartridges(c.req.param("vendorId")),
      },
    })),
);

vendors.get(
  "/:vendorId/cartridges/:cartridgeId/",
  (c) =>
    c.html(render("./main/layouts/default.html", {
      templatePath: "../templates/cartridge.html",
      _: {
        cartridge: getCartridge(
          c.req.param("vendorId"),
          c.req.param("cartridgeId"),
        ),
        vendor: getVendor(c.req.param("vendorId")),
      },
    })),
);
