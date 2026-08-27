---
description: 'CI環境でPRレビューを実行し、GitHub Reviews APIで投稿する'
argument-hint: '[PR番号]'
allowed-tools: Skill, Bash, Write, Read, Glob, Grep, Task
---

`$ARGUMENTS` が未指定なら「PR番号を指定してください（例: `/review-ci 1234`）」と案内して終了。

以下の変数を定義する:

- `PR_NUM` = `$ARGUMENTS`
- `REPO` = `gh repo view --json nameWithOwner -q .nameWithOwner` の実行結果

## 1. レビュー実施

`review-in-worktree` スキルを `$PR_NUM` を引数として実行する。

レビューが完了し markdown ファイルが出力されたら、次のステップに進む。

## 2. レビュー結果を分割 JSON として書き出す

レビュー結果の markdown を元に、以下のファイルを Write で生成する。
**各ファイルは小さく保つこと（1ファイル = 1コメント）。1回の Write で全コメントをまとめて書かない。**

### 2-1. 総評ファイル

`review-pr-${PR_NUM}/body.txt` に総評を書き出す。内容:

- 「総評」セクションの内容
- 末尾に `<details><summary>⚪ 検証の結果問題なし（N件）</summary>` ブロックで、「検証の結果問題なし」の全項目を記載する（各項目は「**[ファイルパス:行番号]** 当初の懸念 → 問題ない理由」の形式）。該当がなければ省略

### 2-2. コメントファイル（1件ずつ分割）

`review-pr-${PR_NUM}/comments/` ディレクトリを作成し、指摘事項（Critical, Warning, Suggestion, 対応漏れの可能性）を 1 件ずつ個別ファイルとして Write する。

- ファイル名: `001.json`, `002.json`, `003.json`...
- 各ファイルの内容は以下の JSON オブジェクト 1 つのみ:

```json
{
  "path": "src/example.ts",
  "line": 42,
  "side": "RIGHT",
  "body": "🔴 Critical: 指摘内容\n\n```suggestion\n修正案のコード\n```"
}
```

ルール:
- `body` には severity 絵文字プレフィックス（🔴 / 🟡 / 🔵 / 🟣）を付ける
- 修正案がある場合は suggestion コードブロックを含める
- `line` はコメントを付ける行番号（diff の RIGHT side）
- 指摘が 0 件の場合は `review-pr-${PR_NUM}/comments/` ディレクトリを作成しない（空配列で投稿する）

## 3. JSON 結合と投稿

以下の Bash コマンドで `review-payload.json` を結合し、投稿する:

```bash
DIR="review-pr-${PR_NUM}"
if [ -d "${DIR}/comments" ] && [ "$(ls ${DIR}/comments/)" ]; then
  jq -n --rawfile body "${DIR}/body.txt" --slurpfile comments <(jq -s '.' ${DIR}/comments/*.json) \
    '{body: $body, event: "COMMENT", comments: $comments[0]}' > "${DIR}/payload.json"
else
  jq -n --rawfile body "${DIR}/body.txt" \
    '{body: $body, event: "COMMENT", comments: []}' > "${DIR}/payload.json"
fi
```

```bash
gh api "repos/${REPO}/pulls/${PR_NUM}/reviews" --method POST --input "review-pr-${PR_NUM}/payload.json"
```
