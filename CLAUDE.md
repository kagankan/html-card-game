# CLAUDE.md

## git コマンドの呼び出し規約

permission のマッチはコマンド文字列の先頭一致で行われる。`Bash(git status *)` を allow、`git push` を ask のように制御するには、私が git を呼ぶ書き方を固定しておく必要がある。

### 必ずサブコマンドを先頭に置く

`git` の直後にサブコマンド（`status` / `push` / `log` など）を置く。

```
git status
git push origin main
```

### サブコマンドの前にグローバルオプションを挟まない

`git` とサブコマンドの間に以下のようなオプションを差し込まない。これらが入ると `git status *` 等の prefix 許可にマッチせず、`git push` を ask に保つ制御も崩れる。

- `-C <path>`（作業ディレクトリ指定）
- `-c <key>=<value>`（設定の上書き）
- `--git-dir=<path>` / `--work-tree=<path>`

```
# NG — git status * にマッチしない
git -C ../other status
git -c core.pager=cat log
```

### 別ディレクトリのリポジトリを操作したいとき

`git -C` は使わず、対象を明示したうえで実行可否をユーザーに確認する。既定の作業ディレクトリ（このリポジトリ）に対しては、サブコマンド先頭形式のまま実行する。
