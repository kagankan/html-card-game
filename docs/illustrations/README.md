# illustrations

カード用イラストのテイスト・キャラデザ・プロンプト・生成結果を管理する場所。

## ディレクトリ構成

```
docs/illustrations/
├── README.md                       ← このファイル
├── style-guide.md                  ← 全体のテイスト・色・構図・共通プロンプト
├── characters/
│   └── <character-name>/           ← キャラ1人 = 1ディレクトリ
│       ├── design.md               ← キャラ設定（名前・文章プロンプト・否定プロンプト）
│       └── refs/                   ← キャラデザ参照画像（複数アングル等）
└── cards/
    └── <card-name>/                ← カード1枚 = 1ディレクトリ
        ├── prompt.md               ← そのカード固有の構図・要素プロンプト
        ├── final.png               ← 採用版（1枚）
        └── iterations/             ← 試作・ボツ（.gitignore で除外）
```

アプリ配信用は `public/cards/<card-name>.png`。`docs/illustrations/cards/<card-name>/final.png` を正として、ビルド時または手動で `public/` にコピーする運用。

## 役割分担

- **style-guide.md** — 全カード共通のテイスト・色・構図ルール・共通プロンプト・ネガティブプロンプト。
- **characters/\<name\>/design.md** — キャラごとの設定。文章プロンプトに加え、参照画像をChatGPTに渡す際の指示も書く。参照画像は同階層の `refs/` に置く。
- **cards/\<name\>/prompt.md** — そのカード固有の「何を・どんな構図で描くか」だけ。共通テイストやキャラ設定は重複させず、参照する形にする。

## 生成フロー（想定）

1. `style-guide.md` の共通プロンプト + ネガティブプロンプト
2. 必要なら `characters/<name>/design.md` の設定 + `characters/<name>/refs/` の画像
3. `cards/<name>/prompt.md` の固有プロンプト

の順に組み合わせてChatGPTに投げる。生成結果のうち採用版だけ `final.png` として残し、試作は `iterations/` に置く（Gitには入らない）。

## 試作画像の扱い

`docs/illustrations/**/iterations/` は `.gitignore` で除外。試作はローカルかGoogle Driveで管理し、リポジトリには採用版のみコミットする。
