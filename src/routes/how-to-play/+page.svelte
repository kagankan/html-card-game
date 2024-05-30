<script>
  import { base } from "$app/paths";
</script>

<svelte:head>
  <title>HTML大富豪の遊び方</title>
</svelte:head>

<article>
  <header>
    <a href="{base}/">戻る</a>
  </header>
  <h1>HTML 大富豪とは？</h1>

  <p>
    HTML
    大富豪は、HTMLの要素をカードに見立てて遊ぶ大富豪（トランプゲーム）です。
  </p>

  <h2>ルール</h2>
  <p>
    前の人が出した要素（カード）の中に入れられる要素（カード）を出していって、手札のカードをなくした人が勝ちです。
  </p>
  <p>順番が来たら、場に出ている要素の中に入れられる要素を出します。</p>

  <section>
    <h3>HTMLのコンテンツモデル</h3>
    <p>
      HTML要素には<a
        href="https://html.spec.whatwg.org/multipage/dom.html#content-models"
        >コンテンツモデル</a
      >と呼ばれる、その要素の中に入れてよい要素のルールが決まっています。
    </p>
    <p>
      例えば、 <code>ul</code>要素の中には<code>li</code
      >要素を入れることはできますが、それ以外の要素をいれることはできません。
    </p>
  </section>

  <p>どのカードも出せないときはパスします。</p>
  <p>
    全員がパスをしたら、場のカードをリセットして、最後にカードを出した人から再開します。
  </p>
  <p>場になにも出ていないときは、どのカードでも出すことができます。</p>
  <p>手札がなくなったらあがりです。</p>
</article>

<style lang="scss">
  * {
    &:where(h2) {
      // @include typography(h2);
      &:where(:not(:first-child)) {
        margin-top: 4rem;
        &:is(.box *) {
          margin-top: 3rem;
        }
      }
      &:where(:not(:last-child)) {
        margin-bottom: 2rem;
      }
    }

    &:where(h3) {
      // @include typography(h3);
      &:where(:not(:first-child)) {
        margin-top: 4rem;
      }
      &:where(:not(:last-child)) {
        margin-bottom: 1.5rem;
      }
    }

    &:where(h4) {
      // @include typography(h4);
      &:where(:not(:first-child)) {
        margin-top: 3rem;
      }
      &:where(:not(:last-child)) {
        margin-bottom: 1.5rem;
      }
    }

    &:where(h5) {
      // @include typography(h5);
      &:where(:not(:first-child)) {
        margin-top: 2.5rem;
      }
      &:where(:not(:last-child)) {
        margin-bottom: 1.25rem;
      }
    }

    &:where(h6) {
      // @include typography(h6);
      &:where(:not(:first-child)) {
        margin-top: 2rem;
      }
      &:where(:not(:last-child)) {
        margin-bottom: 1.25rem;
      }
    }

    &:where(p) {
      margin-top: 1rem;
    }

    &:where(a) {
      color: var(--color-link);
      text-decoration: underline;
      &[target="_blank"] {
        &::after {
          display: inline-block;
          width: 1em;
          height: 1em;
          margin-left: 0.2em;
          overflow: hidden;
          content: "（新しいタブで開く）";
          background-color: currentColor;
          mask-image: var(--icon-open-in-new);
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: contain;
        }
      }
      &[href$="pdf"] {
        &::after {
          display: inline-block;
          width: 1em;
          height: 1em;
          margin-left: 0.2em;
          overflow: hidden;
          content: "（PDF）";
          background-color: currentColor;
          mask-image: var(--icon-pdf);
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: contain;
        }
      }
    }

    &:where(code) {
      font-family: var(--font-family-monospace);
      &:not(:where(pre *)) {
        padding: 0.2em 0.4em;
        font-size: 90%;
        background-color: #f6f7f8;
        border: 0.1rem solid var(--color-border);
        border-radius: 0.25rem;
        // font-size: 16px;
        // font-family: var(--font-mono);
        // background-color: rgba(255, 255, 255, 0.45);
        // border-radius: 3px;
        // box-shadow: 2px 2px 6px rgb(255 255 255 / 25%);
        // padding: 0.5em;
        // overflow-x: auto;
        // color: var(--color-text);
      }
    }
    &:where(kbd) {
      padding: 0.2em 0.4em;
      font-family: var(--font-family-monospace);
      font-size: 90%;
      background-color: var(--color-white);
      border: 1px solid var(--color-border);
      border-radius: 0.25rem;
      box-shadow: inset 0 -1px 0 var(--color-border);
    }
  }
</style>
