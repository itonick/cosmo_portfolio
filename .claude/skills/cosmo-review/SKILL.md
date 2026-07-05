---
name: cosmo-review
description: cosmo_portfolio の差分をレビューしたいときに使う。正しさ・design/README.md との整合・cleanup 漏れ・アクセシビリティ・パフォーマンス・可読性を判断して指摘する。実装は行わず指摘のみ。
---

# cosmo-review — コードレビュー

「良し悪しの判断」を伴うレビュー。**モデルはこのスキルでは決めず、`reviewer` サブエージェント（Opus4.8 に固定）へ委譲する**。

## 手順
1. **範囲を渡す**：レビュー対象の差分（`git diff` の範囲、PR、ファイル群）と、注意してほしい観点があれば添える。
2. **`reviewer` に委譲**：Agent ツールで `subagent_type: reviewer` を呼ぶ。重要度つき（must/should/nit）の指摘・根拠・`file:line`・直す方向性を受け取る。
3. **事実確認は checker へ**：lint/型/build のような機械的確認が要る指摘は、`cosmo-qa`（checker/Haiku）に回す。レビューは判断に集中させる。
4. **反映**：修正の実装は `cosmo-build`（builder/Sonnet）またはメインで行う。reviewer には実装させない。

## エスカレーション
- reviewer が「全体設計の作り直しが要る」と申し送ったら、それは Fable 案件。メインで Fable 切替を提案する（CLAUDE.md の切替ルール参照）。
