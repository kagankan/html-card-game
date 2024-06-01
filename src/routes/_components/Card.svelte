<script lang="ts">
  import type { ElementName } from "./constants";
  import { formatHtml } from "./content-model";

  export let element: ElementName;
  export let description = "";
  export let onClick: (() => void) | undefined = undefined;
  export let disabled = false;
  export let selected = false;
  export let style: string | undefined = undefined;
</script>

<section
  class="relative isolate aspect-[58/89] w-full overflow-clip rounded-lg shadow {disabled
    ? 'bg-gray-300'
    : 'bg-white'} {selected ? 'border-4 border-blue-500' : ''}"
  {style}
>
  <button
    type="button"
    on:click={onClick}
    class=" h-full w-full p-2 disabled:text-gray-500"
    {disabled}
    aria-pressed={selected}
  >
    <span class=" absolute left-0 top-0">&lt;{element}&gt;</span>
    <span class="text-3xl font-bold">{element}</span>
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
