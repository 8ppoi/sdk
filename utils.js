import { dirname } from "@std/path";
import { fileTypeFromFile } from "file-type";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

export async function respondImageWithMime(c)
{
  const filePath = `${currentFileDir}/${c.req.path}`;

  let mime = "application/octet-stream";

  const ft = await fileTypeFromFile(filePath);
  if (ft?.mime) {
    mime = ft.mime;
  } else {
    const text = await Deno.readTextFile(filePath);
    if (text.includes("<svg")) {
      mime = "image/svg+xml";
    }
  }

  const body = await Deno.readFile(filePath);
  return new Response(body, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "no-cache",
    },
  });
}

