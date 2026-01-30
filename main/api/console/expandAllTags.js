// 全タグを展開（既存ディレクトリはスキップ）
export async function expandAllTags() {
  const baseDir = "consoles";
  const mainDir = `${baseDir}/main`;

  // tag 一覧取得
  const p = new Deno.Command("git", {
    args: ["tag"],
    cwd: mainDir,
    stdout: "piped",
  });
  const { stdout } = await p.output();

  const tags = new TextDecoder()
    .decode(stdout)
    .trim()
    .split("\n")
    .filter(Boolean);
console.log(tags);
return;

  for (const tag of tags) {
    const targetDir = `${baseDir}/${tag}`;

    try {
      await Deno.stat(targetDir);
      continue; // あればスキップ
    } catch {
      // 無ければ作る
    }

    await Deno.mkdir(targetDir, { recursive: true });

    // git archive <tag> | tar -x -C ../<tag>
    const cmd = new Deno.Command("sh", {
      args: [
        "-c",
        `git archive ${tag} | tar -x -C ../${tag}`,
      ],
      cwd: mainDir,
    });

    await cmd.output();
  }
}

