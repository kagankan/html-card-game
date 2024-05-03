<script lang="ts">
  export let title = "";
  export let description = "";
  export let onClick: () => void;
  export let disabled = false;
</script>

<section
  class="aspect-[58/89] w-40 rounded-lg bg-white shadow {disabled
    ? 'bg-gray-300 text-gray-700'
    : ''}"
>
  <button
    type="button"
    on:click={onClick}
    class="h-full w-full p-4 disabled:text-gray-500"
    {disabled}
  >
    <span class="text-3xl font-bold">{title}</span>
    {#if description}<span class="block">{description}</span>{/if}
  </button>
  <!-- <ul class="Card__Categories">
    <li>メタデータ</li>
    <li class="category-flow">フロー</li>
    <li>ヘディング</li>
    <li class="category-palpable">パルパブル</li>
  </ul>
  <p>4.4.15</p>
  <p><b>{"<div></div>"}</b></p>
  <p class="description">
    div要素は、一切特別な意味を持たない。この要素は、要素の子を表す。この要素は、class、lang、および連続した要素のグループに共通のセマンティックスをマークアップするtitle属性とともに使用できる。dt要素とdd要素のグループを包む、dl要素でも使用できる。
  </p>
  <div>
    <h3>使用できるコンテキスト</h3>
    <p>フローコンテンツが期待される場所。<br />dl要素の子として。</p>
    <h3>コンテンツモデル</h3>
    <p>
      要素がdl要素の子である場合：1つ以上のdt要素の後に1つ以上のdd要素が続き、必要に応じてスクリプトサポート要素と混在する。<br
      />要素がdl要素の子でない場合：フローコンテンツ。
    </p>
  </div>
  <cite>https://momdo.github.io/html/grouping-content.html#the-div-element</cite
  > -->
</section>
