// Claude Code の PreToolUse hook。REVIEW_DEADLINE（UNIX 秒）を過ぎたら、
// レビュー結果の書き出しと投稿に必要なツール以外をブロックし、まとめに移らせる。
// exit 2 で終了すると、そのツール呼び出しは中止され、stderr の内容が Claude に渡される。
import { readFileSync } from 'node:fs';

const deadline = Number(process.env.REVIEW_DEADLINE);
// 締め切りが未設定なら制限しない（hook の不具合でレビュー自体を止めないため）
if (!Number.isFinite(deadline) || Date.now() / 1000 < deadline) process.exit(0);

const { tool_name: toolName, tool_input: toolInput = {} } = JSON.parse(readFileSync(0, 'utf8'));

const isReviewOutput = (path = '') => /(^|\/)review-pr-\d+\//.test(path) || /_review_[^/]*\.md$/.test(path);

const allowed =
  ((toolName === 'Write' || toolName === 'Read') && isReviewOutput(toolInput.file_path)) ||
  (toolName === 'Bash' && /^\s*(jq\b|DIR=|gh api\s+\S*\/reviews\b)/.test(toolInput.command ?? ''));

if (allowed) process.exit(0);

console.error(
  '時間切れ: レビューの制限時間に達したため、これ以上の調査はできない。' +
    'サブエージェントの場合は、ここまでの結果をすぐに返すこと。' +
    'メインの場合は、ここまでの指摘だけで review-pr-<PR番号>/ 配下のファイルを Write し、jq で結合して gh api で投稿すること。',
);
process.exit(2);
