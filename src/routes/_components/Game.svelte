<script lang="ts">
  import { checkNext, formatHtml } from "./game";
  import { browser } from "$app/environment";
  import type { ElementName } from "./constants";
  import Card from "./Card.svelte";

  let hand: ElementName[] = [
    "div",
    "span",
    "a",
    "hr",
    "p",
    "button",
    "ul",
    "li",
    "br",
  ];
  let nesting: ElementName[] = ["body"];
  $: current = nesting[nesting.length - 1];
</script>

<pre><code>{formatHtml(nesting, 2)}</code></pre>

<ul class=" mt-8 grid auto-cols-auto grid-flow-col">
  <!-- for -->
  {#each hand as el}
    {@const ok = browser ? checkNext(nesting, el) : false}
    <li class=" w-24 transition-transform hover:z-10 hover:-translate-y-4">
      <Card
        title={el}
        description={el === "a" ? " (hrefなし)" : ""}
        onClick={() => {
          nesting = [...nesting, el];
          hand = hand.filter((n) => n !== el);
        }}
        disabled={!ok}
      />
    </li>
  {/each}
</ul>
