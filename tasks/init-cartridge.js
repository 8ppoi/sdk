import { Gh } from "./util/Gh.js";
import { command } from "./util/command.js";

// GitHub personal access token を設定
Gh.init(Deno.readTextFileSync("./.credentials"));

// GitHub ユーザ情報を取得
const user = await Gh.fetch("user");

// カートリッジディレクトリを作成
const cartridgeId = "first-cartridge";
Deno.mkdirSync(`./vendors/${user.login}/cartridges/${cartridgeId}`, {
  recursive: true,
});

// アバターをGitHubから取得
const resp = await fetch(user.avatar_url);
const buffer = await resp.arrayBuffer();
Deno.writeFileSync(
  `./vendors/${user.login}/cartridges/${cartridgeId}/artwork`,
  new Uint8Array(buffer),
);

// meta.jsonを作成
Deno.writeTextFileSync(
  `./vendors/${user.login}/cartridges/${cartridgeId}/meta.json`,
  `{
  "consoleVersion": "1.0.0-alpha.1",
  "name": "${cartridgeId}",
  "artwork": "artwork",
  "description": "B0（キーボードではZ）とB1（キーボードではX）を押すと、色の付いた文字が踊ります🎵"
}`,
);

// Cartridge.js 作成
Deno.writeTextFileSync(
  `./vendors/${user.login}/cartridges/${cartridgeId}/Cartridge.js`,
  `export class Cartridge {
  static onReset({ pads, speakers, screens }) {
    this.pads = pads;
    this.speakers = speakers;
    this.screens = screens;

    this.screens[0].setViewBox(0, 0, 64, 48);

    this.msg0 = this.screens[0].addText("${cartridgeId}", {
      x: 2,
      y: 32,
      colorIds: [null, Math.floor(Math.random() * 7) + 9],
    });

    this.msg1 = this.screens[0].addText("${user.login}", {
      x: 2,
      y: 40,
      colorIds: [null, Math.floor(Math.random() * 7) + 1],
    });
  }

  static onFrame() {
    if (this.sfx?.ended) {
      delete this.sfx;
    }
    if (this.pads[0].buttons.b0.pressed) {
      this.msg0.y -= 2;
      if (!this.sfx) {
        this.sfx = this.speakers[0].play([
          [
            { noteNumber: [0, 4, 7, 11, 12][Math.floor(Math.random() * 5)], duration: 8 },
          ]
        ]);
      }
    }
    this.msg0.y += 1;
    this.msg0.y = Math.min(this.msg0.y, 32);

    if (this.pads[0].buttons.b1.pressed) {
      this.msg1.y -= 2;
      if (!this.sfx) {
        this.sfx = this.speakers[0].play([
          [
            { noteNumber: [0, 4, 7, 10, 12][Math.floor(Math.random() * 5)] - 5, duration: 8 },
          ]
        ]);
      }
    }
    this.msg1.y += 1;
    this.msg1.y = Math.min(this.msg1.y, 40);
  }
}
`,
);

// ローカルリポジトリ設定
Deno.chdir(`./vendors/${user.login}/cartridges/${cartridgeId}`);
command(["git", "init"]);
command([
  "git",
  "remote",
  "add",
  "origin",
  `https://github.com/${user.login}/8ppoi-cartridge-${cartridgeId}.git`,
]);
command(["git", "add", "-A"]);
command(["git", "commit", "--allow-empty-message", "-m", ""]);
