# HTML 大富豪

HTMLの要素とコンテンツモデル(入れ子ルール)をゲーム化したカードゲームです。  
楽しみながらHTMLの構造を学ぶことができます。

## 公開URL

- Firebase Hosting: https://html-card-game.web.app/
- GitHub Pages: https://kagankan.github.io/html-card-game/

## 技術仕様

- **フレームワーク**: Next.js 15
- **ライブラリ**: React 19
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ビルド**: Static Site Generation (SSG)
- **デプロイ**: Firebase Hosting / GitHub Pages

## 開発

依存関係をインストールしてから、開発サーバーを起動します:

```bash
npm install
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## ビルド

本番環境用のビルドを作成します:

```bash
npm run build
```

ビルドされたファイルは `out` ディレクトリに出力されます。

## テスト

```bash
# 全てのテストを実行
npm test

# ユニットテストのみ実行
npm run test:unit

# E2Eテストのみ実行
npm run test:integration
```

## リント・フォーマット

```bash
# リントチェック
npm run lint

# コードフォーマット
npm run format
```
