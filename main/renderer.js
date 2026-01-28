import { dirname } from "@std/path";

const stack = [];

export function render(path, _) {
  const script = `\`${
    Deno.readTextFileSync(path).replaceAll("`", "\`")
      .replace(/<!--[\s\S]*?-->/g, "")
  }\``;
  const cwd = Deno.cwd();
  let returanValue;
  try {
    stack.push(path);
    Deno.chdir(dirname(path));
    returanValue = eval(script);
  } catch (e) {
    console.error(error(e));
    return `<pre class="error">${error(e)}</pre>`;
  } finally {
    Deno.chdir(cwd);
    stack.pop();
  }
  return returanValue;
}

export function renderIf(condition, path, _) {
  return condition ? render(path, _) : "";
}

export function renderMap(path, _s, as, additional = {}, delimiter = "\n") {
  return _s.map((_) => render(path, { ...additional, [as]: _ })).join(
    delimiter,
  );
}

export function dump(_) {
  return [
    "<pre>",
    JSON.stringify(_, null, 2),
    "</pre>",
  ].join("\n");
}

export function error(e) {
  return `${e.toString()}\n at ${stack.toReversed().join(" \n at")}\n`;
}
