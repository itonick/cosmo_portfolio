---
name: cosmo-qa
description: cosmo_portfolio で lint / 型チェック / ビルド / テストの実行と、チェックリスト照合（cleanup 漏れ・reduced-motion・スペック値の一致・ダミー残り）など機械的検査をしたいときに使う。原因診断や修正方針は出さず、事実だけを整理する。
---

# cosmo-qa — 機械的検査

判断を伴わない検査。**モデルはこのスキルでは決めず、`checker` サブエージェント（Haiku4.5 に固定）へ委譲する**。

## 手順
1. **検査項目を渡す**：実行するコマンド（lint/typecheck/build/test）や、照合するチェックリストを指定する。定番チェックリスト：
   - Three.js cleanup（RAF cancel / リスナー除去 / IntersectionObserver disconnect / geometry・material・texture・renderer dispose / canvas 除去）。
   - `prefers-reduced-motion` 分岐の有無。
   - `design/README.md` の確定値と実装値の一致。
   - ダミー文言（氏名・日付・メトリクス・リンク）の残存有無。
2. **`checker` に委譲**：Agent ツールで `subagent_type: checker` を呼ぶ。合否・件数・`file:line`・原文抜粋を受け取る。
3. **次の一手**：❌ の原因診断は `cosmo-review`（reviewer/Opus）、修正は `cosmo-build`（builder/Sonnet）へ。checker には診断も修正もさせない。
