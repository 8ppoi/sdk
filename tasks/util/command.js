export function command(args, quiet = false) {
  const textDecoder = new TextDecoder();
  const cmd = args.shift();
  const result = new Deno.Command(cmd, {
    args,
    stdout: "piped",
    stderr: "piped",
  }).outputSync();
  if (result.code !== 0) {
    const err = textDecoder.decode(result.stderr);
    throw new Error(err);
  }
  const output =
    (textDecoder.decode(result.stdout) + textDecoder.decode(result.stderr))
      .trim();
  if (!quiet && output !== "") {
    console.log(output);
  }
  return output;
}
