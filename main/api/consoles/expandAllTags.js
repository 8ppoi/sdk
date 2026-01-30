import { dirname } from "@std/path";
import { command } from "../../command.js";

const currentFileDir = dirname(new URL(import.meta.url).pathname);

// 全タグを展開（既存ディレクトリはスキップ）
export function expandAllTags() {
  const baseDir = `${currentFileDir}/../../../consoles`;
  const mainDir = `${baseDir}/main`;

  const results = [];

  // tag 一覧取得
  const output = command(["git", "tag"], { cwd: mainDir });
  const tags = output.trim().split("\n").filter(Boolean);

  for (const tag of tags) {
    const targetDir = `${baseDir}/${tag}`;

    try {
      Deno.statSync(targetDir);
      results.push(`✅ スキップ： ${tag}は存在します\n`);
      continue; // あればスキップ
    } catch {
      // 無ければ作る
    }

    Deno.mkdirSync(targetDir, { recursive: true });
    command(["sh", "-c", `git archive ${tag} | tar -x -C ../${tag}`], {
      cwd: mainDir,
    });
    results.push(`✅ 展開： ${tag}を展開しました\n`);
  }
  return results.join("");
}
