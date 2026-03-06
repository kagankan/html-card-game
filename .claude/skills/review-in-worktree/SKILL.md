---
description: "PR番号を指定して厳格なコードレビューを実行"
argument-hint: "[PR番号]"
allowed-tools: Bash, Read, Glob, Grep, Task, Write
---

`$ARGUMENTS` が未指定なら「PR番号を指定してください（例: `/review-in-worktree 1234`）」と案内して終了。

以下、`PR_NUM` は `$ARGUMENTS`、`WORKTREE` は `/tmp/review-pr-${ARGUMENTS}`、`OUTPUT` は `${ARGUMENTS}_review.md`（カレントディレクトリ）とする。

## 1. 準備

元ブランチには一切影響を与えないこと。git stash やブランチ切り替えは禁止。worktree で隔離してレビューする。

以下を順に実行する：

1. PR 情報を取得する。

   ```bash
   gh pr view <PR_NUM> --json title,body,baseRefName,headRefName,additions,deletions,changedFiles,labels,url
   ```

2. PR 情報から `headRefName` を取得し、フェッチする。

   ```bash
   git fetch origin <headRefName>
   ```

3. worktree を作成する。既に存在する場合は先に削除する。

   ```bash
   git worktree remove <WORKTREE> --force 2>/dev/null || true
   git worktree add <WORKTREE> origin/<headRefName>
   ```

4. diff を取得する。
   ```bash
   gh pr diff <PR_NUM>
   gh pr diff <PR_NUM> --name-only
   ```

worktree 内のファイルを参照する場合は Read ツールで `<WORKTREE>/path/to/file` のように絶対パスを指定すること。

## 2. レビュー観点

**修正すべき点のみ指摘する。良い点・称賛は不要。** CONTRIBUTING.md があればそのレビュー基準も参照すること。diff だけでは前後の文脈が不足する場合は、worktree 内の関連ファイルを Read で確認すること。

### 全PR共通

**最重要:** PR目的の明確さ / 単一責任原則 / Issue要件の充足

**必須チェック（優先度順）:**

1. バグ・論理エラー
2. セキュリティ（XSS、インジェクション、機密情報漏洩）
3. エッジケース（null/undefined、空配列、境界値）
4. 型安全性
5. テストの網羅性
6. パフォーマンス（不要な再レンダリング、N+1、メモリリーク）
7. コーディング規約・既存パターンとの一貫性
8. 不要コード（console.log、コメントアウト）

**React追加チェック:**

- useMemo/useCallbackの過不足、useEffectの依存配列
- コンポーネントの責務分離、Propsの型定義

**コード品質:** 命名の明確さ / 関数の長さ / ネストの深さ / マジックナンバー / エラーハンドリング

### 削除系・移行系PRの追加チェック

タイトル・説明・変更内容が削除/移行/リネーム/deprecateに該当する場合、`Grep` で以下を**徹底検索**：

- **参照漏れ**: 削除した識別子名でプロジェクト全体を検索（import、型参照、テスト、Storybook、設定ファイル）
- **ルーティング漏れ**: URL/ルート定義変更時のリンク・リダイレクト更新
- **設定ファイル**: webpack/jest/tsconfig/eslint等に残った参照
- **フィーチャーフラグ**: 関連コードの残存
- **テスト・Storybook**: 削除機能のテストやStoryの残存

## 3. 出力

以下のテンプレートに従って `<OUTPUT>` に Write で出力する。

```markdown
# PR #<PR_NUM> レビュー結果

**PR タイトル**: （タイトル）
**PR URL**: （URL）
**ブランチ**: （head → base）
**変更規模**: +（additions）/ -（deletions）/ （changedFiles）ファイル

---

## 指摘事項

### 🔴 Critical（マージ前に必ず修正）

<!-- バグやセキュリティ問題が発生するもの -->

- **[ファイルパス:行番号]** 指摘内容
  `（該当コード）`
  **修正案**: （具体的なコード）

### 🟡 Warning（強く修正を推奨）

<!-- 保守性・品質に影響があるもの -->

- **[ファイルパス:行番号]** 指摘内容

### 🔵 Suggestion（修正を検討）

<!-- より良いコードにするための提案 -->

- **[ファイルパス:行番号]** 指摘内容

### 🟣 対応漏れの可能性（削除系・移行系のみ）

- **[ファイルパス:行番号]** 指摘内容

---

**総評**: （1～2文。マージ可能な状態か）
```

指摘がないセクションは省略可。各指摘には必ずファイルパスと行番号を含め、修正案は具体的なコードで示す。

## 4. 後片付け

```bash
git worktree remove <WORKTREE> --force 2>/dev/null || true
```

```bash
if command -v code &>/dev/null; then
  code <OUTPUT>
fi
```

VS Code が利用できない場合は、ファイルパスを案内するのみとする。
