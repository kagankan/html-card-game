# illustrations

カード用イラストのテイスト・キャラデザ・プロンプト・生成結果を管理する場所。

## ディレクトリ構成

```
docs/illustrations/
├── README.md                       ← このファイル
├── style-guide/
│   ├── README.md                   ← 全体のテイスト・色・構図の仕様
│   └── refs/                       ← スタイル参照画像
├── characters/
│   └── <character-name>/           ← キャラ1人 = 1ディレクトリ
│       ├── design.md               ← キャラ設定
│       └── refs/                   ← キャラデザ参照画像（複数アングル等）
└── cards/
    └── <card-name>/                ← カード1枚 = 1ディレクトリ
        ├── prompt.md               ← そのカード固有の構図・要素プロンプト
        ├── final.png               ← 採用版（1枚）
        └── iterations/             ← 試作・ボツ（.gitignore で除外）
```

アプリ配信用は `public/cards/<card-name>.png`。`docs/illustrations/cards/<card-name>/final.png` を正として、ビルド時または手動で `public/` にコピーする運用。

## 役割分担

- **style-guide/README.md** — 全カード共通のテイスト・色・構図ルール。参照画像は同階層の `refs/`。
- **characters/\<name\>/design.md** — キャラごとの設定。参照画像は同階層の `refs/`。
- **cards/\<name\>/prompt.md** — そのカード固有の「何を・どんな構図で描くか」だけ。共通テイストやキャラ設定は重複させず、参照する形にする。

## 生成フロー（想定）

ChatGPTで画像生成する際、以下を参考資料として渡す：

1. `style-guide/` — テイスト・色・構図の仕様と参照画像
2. 該当キャラがいれば `characters/<name>/refs/character-sheet.png`（見た目の一貫性のため必須）と `design.md`
3. `cards/<name>/prompt.md` のカード固有の構図・要素

生成結果のうち採用版だけ `final.png` として残し、試作は `iterations/` に置く（Gitには入らない）。

## 試作画像の扱い

`docs/illustrations/**/iterations/` は `.gitignore` で除外。試作はローカルかGoogle Driveで管理し、リポジトリには採用版のみコミットする。
