const whiteList = [
  "globalThis",

  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",

  "Object",
  "Boolean",
  "Symbol",

  "Number",
  "BigInt",
  "Math",
  "Date",

  "String",
  "RegExp",

  "Array",
  "TypedArray",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  "Float16Array",
  "Float32Array",
  "Float64Array",

  "Map",
  "Set",
  "WeakMap",
  "WeakSet",

  "ArrayBuffer",
  "DataView",
  "JSON",

  "console",
  "structuredClone",
];

const objectWhiteList = [
  "assign",
  "entries",
  "keys",
  "values",
];

const retained = {
  getOwnPropertyNames: Object.getOwnPropertyNames,
  getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
};

function sanitizeObject() {
  for (const prop of retained.getOwnPropertyNames(Object)) {
    const descriptor = retained.getOwnPropertyDescriptor(Object, prop);
    if (descriptor.configurable) {
      if (!objectWhiteList.includes(prop)) {
        delete Object[prop];
      }
    }
  }
}

export function sanitize() {
  const retainedGlobals = {
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    setTimeout: globalThis.setTimeout.bind(globalThis),
    AudioContext: globalThis.AudioContext.bind(globalThis),
  };

  for (const prop of retained.getOwnPropertyNames(globalThis)) {
    const descriptor = retained.getOwnPropertyDescriptor(globalThis, prop);
    if (descriptor.configurable) {
      if (!whiteList.includes(prop)) {
        delete globalThis[prop];
      }
    }
  }

  sanitizeObject();

  return retainedGlobals;
}
