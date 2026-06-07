# HTML要素イラスト生成 指示書

## 目的

HTML要素を、単なるUI図やHTMLタグの説明ではなく、「その要素が持つ意味・役割・ユーザーとの関係」が直感的に伝わる概念イラストとして表現する。
説明図ではなく、カードや教材のイラストとして使える「小さなシーン」にする。

## 全体コンセプト

HTML要素を、役割に応じた行為・関係・空間として描く。

例：

- ボタン系要素 → 押す、起動する、操作する
- ナビゲーション系要素 → 導く、道を選ぶ、移動する
- コンテンツ系要素 → 読む、内容に没入する
- ダイアログ系要素 → 対話する、開いて応答する
- セクション系要素 → 区切る、整理する
- 見出し系要素 → 情報構造の階層を示す

要素そのものを単体のアイコンにするのではなく、必要に応じてキャラクター・道具・空間・行為を組み合わせて表現する。

## 基本方針

### 1. 要素の「役割」を描く

HTML要素を文字やタグとして描くのではなく、その要素が担う意味論的な役割をイラスト化する。

悪い例：

- HTMLタグをそのまま描く
- ブラウザUIを描く
- ワイヤーフレーム風にする
- 実際のWebページ構造を図示する

良い例：

- 要素の役割や行為を比喩的なシーンとして表現する
- ユーザーとの関係性を描く
- 情報構造や導線を空間的に表現する
- （言語情報が必要な場合）日本語や英語ではなく、存在しない架空の文字や記号を使う

### 2. キャラクターは必要な場合だけ使う

キャラクターは必須ではない。要素ごとに最適な表現を選ぶ。

キャラクターを使う目的は、以下を表現するため：

- 行為
- スケール感
- 感情
- ユーザーとの関係

### 3. 要素ごとにシーンの種類を変える

すべてを同じ構図・同じサイズ感・同じキャラクター表現にしない。
要素の意味に応じて、異なるシーンにする。

## 絵のテイスト

### 目指す方向

- ポップ
- 親しみやすい
- 読みやすい
- シンプル
- 主線なし
- 柔らかいグラデーション
- 適度な立体感
- UIデザイン的に視線誘導が明確

雰囲気としては、以下のような方向：

- Nintendo系の視認性
- モダンなゲームUI用コンセプトイラスト
- 絵本的なわかりやすさ
- 教材カードに使える概念イラスト

### 描画スタイル

- 主線なし
- lineless illustration
- soft gradients
- subtle shading
- matte surfaces
- rounded simplified forms
- clean color separation
- gentle depth
- semi-flat rendering
- soft 3D feeling
- tactile softness

完全なフラット塗りではなく、柔らかい陰影とグラデーションで少し立体感を出す。

### 避ける表現

- 黒いアウトライン
- 太い漫画線
- cel shading
- 完全なベタ塗り
- SVGアイコン風の硬いフラット表現
- 写実的すぎる質感
- 強い光沢
- 劇的すぎるライティング
- ダークファンタジー
- 中世ファンタジー
- 重厚なカードゲーム風

## 色のルール

### 基本方針

ポップさは出すが、色数は抑える。

重要なのは、どれがHTML要素の中心モチーフなのかが一目でわかること。

### 配色ルール

- 背景・環境・キャラクターは低彩度にする
- 意味論上の主役オブジェクトだけにアクセントカラーを使う
- アクセントカラーは1〜2色程度に抑える
- 色数を増やしすぎない
- 全部をカラフルにしない

例：

- 主役となる意味論オブジェクトだけアクセントカラーを使う
- 背景や人物は低彩度に抑える
- 一目で主役がわかる配色にする

### 推奨色

ベースカラー：

- cream
- beige
- soft gray
- muted brown
- pale warm colors

アクセントカラー：

- muted red
- clear blue
- soft green
- gentle purple
- warm yellow

### 色に関するAI向け指示

use color sparingly so the semantic object remains the clear focal point.

The environment and characters should use muted colors, while only the semantic element uses a brighter accent color.

Use a restrained color palette with soft gradients and selective accent colors.

---

## 構図のルール

- 主役を中央または明確な焦点位置に置く
- 背景は簡潔にする
- 余白を残す
- 小さいサイズでも判別できるシルエットにする
- 視線が迷わないようにする
- 情報量を詰め込みすぎない
- 装飾よりも意味の読みやすさを優先する

---

## 共通プロンプト

playful conceptual illustration representing an HTML element, Nintendo-style visual clarity, symbolic but intuitive scene design, lineless illustration, soft gradients and subtle shading, rounded simplified forms, clean readable silhouette, semi-flat rendering with gentle depth, restrained color palette, muted base colors with selective accent colors, minimal background, clear focal point, charming pop atmosphere, focus on semantic role and interaction rather than literal UI.

---

## 追加指示

Each HTML element should use a different type of scene and metaphor depending on its semantic role.

Do not make every element the same “tiny character plus oversized object” composition.

Characters may appear only when they help show action, scale, emotion, or interaction.

Use color sparingly so the semantic object remains the clear focal point.

The environment and characters should use muted colors, while only the semantic element uses a brighter accent color.

---

## ネガティブプロンプト

no text, no letters, no HTML tags, no browser UI, no web page mockup, no wireframe, no infographic, no lorem ipsum, no black outlines, no comic ink, no cel shading, no harsh shadows, no glossy realism, no dark fantasy, no medieval fantasy, no cinematic dramatic lighting, no busy background, no rainbow colors, no highly saturated colors everywhere.

---

Use the same recurring character design in every image: a small chibi adventurer with a rounded blue explorer hat, dome-shaped crown, short soft brim, small top button, soft cream face, two vertical oval black eyes, no visible nose, no eyebrows, no detailed mouth, blue explorer outfit, small brown backpack, rounded mitten-like hands, short simple boots. Keep the character identical across illustrations.

no nose, no changed hat, no hood, no beanie, no beret, no baseball cap, no pointed hat, no realistic face, no anime detailed eyes, no eyebrows, no eyelashes, no expressive mouth, no tall body, no slim body
