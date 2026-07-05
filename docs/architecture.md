# 技術方針（確定）

2026-07-05 / Fable メイン判断。以降この方針は既定として扱い、変更は「メイン切替の提案ルール」に従って再度 Fable 案件として扱う。

## スタック：Vite + TypeScript (strict) + three — フレームワークなし

理由：
- 静的な 1 ページで、状態は scroll / mouse / 4 つの設定値（tone/speed/parallax/density）のみ。コンポーネントフレームワークの再レンダリングモデルは「固定 canvas + 実 DOM セクション」という構造に益を足さない。
- シーンロジック（`_build*`・レンダーループ・カメラ）は class へほぼ逐語移植でき、ラッパが薄いほど原典 `design/Cosmic_Portfolio.dc.html` との数値照合が容易。
- 本文が最初から実 DOM（見出し・リンク・テキスト）で、README の a11y 要件（canvas は装飾、本文は選択・読み上げ可能）を素で満たす。
- ランタイム依存が `three` 1 つ、開発依存が `vite`/`typescript`/`@types/three` で済む。

却下案：
- **React + @react-three/fiber** — シーンを JSX 宣言に組み替えると原典との対応が崩れ、逐語移植の検証コストが上がる。R3F の再レンダリング境界の管理も本件では純コスト。
- **Vue / Svelte** — 同様。なぞる既存資産もない。

## ディレクトリ構成

```
index.html            5 セクション + HUD + loader の実マークアップ（a11y の本体）
src/
  main.ts             起動：シーン初期化・UI 配線・破棄の一元経路
  styles/
    tokens.css        デザイントークン（CSS カスタムプロパティ、出典コメント付き）
    base.css          リセット・背景・selection・vignette
    sections.css      5 セクション + カード + チップ + reveal
    hud.css           nav / telemetry / progress / loader / tone 変種
  scene/
    palette.ts        シーン側の確定値（色・座標・粒子数・速度。出典コメント付き）
    config.ts         SceneConfig { tone, speed, parallax, density } と既定値
    helpers.ts        ガウス分布 g()、radial-gradient CanvasTexture、hexShape
    CosmicScene.ts    orchestrator：renderer/camera/fog・レンダーループ・スクロール補間・
                      FOV ワープ・パララックス・resize・dispose
    phenomena/
      storm.ts ring.ts nebula.ts spiral.ts web.ts stars.ts comets.ts
  ui/
    reveal.ts         IntersectionObserver のセクション reveal
    hud.ts            telemetry ラベル + progress bar
    burst.ts          クリックバースト粒子
    loader.ts         ローディングオーバーレイ（4s フォールバック付き）
```

## 移植ポリシー

- `_build*`・レンダーループ・カメラは `.dc.html` から**数値を変えずに**移植する。命名だけ現行流儀に合わせる（先頭 `_` を外す）。
- 色・timing 等の確定値は `src/scene/palette.ts` と `src/styles/tokens.css` に一元化し、マジックナンバーを散らさない。抽出は `token-extractor` が出典 `file:line` 付きで行う。
- 各現象モジュールは `build(ctx) => { group, anims }` を返す。`anims: Array<(t, dt) => void>`。追加・削除・破棄は CosmicScene が共有 `disposeObject()` で一括する。
- **cleanup 契約**：追加した RAF / listener / IntersectionObserver / geometry / material / texture / renderer は、`destroy()` 1 経路で必ず解放する。追加と解放は同じ PR 内で対にする。
- `tone`（observatory / poetic / minimal）は `<html data-tone>` + CSS 変種で切り替える（プロトタイプの style 注入は使わない）。
- `prefers-reduced-motion`：float / gradFlow / idle-sway / comets を停止し、density を 0.6 に落とす。

## 未決事項（Opus の日常判断で確定してよい）

- デプロイ先と Vite `base` パス（GitHub Pages ならリポジトリ名）。
- フォントを Google Fonts CDN のままにするか self-host するか。
