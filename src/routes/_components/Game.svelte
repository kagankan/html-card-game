<script lang="ts">
  import { checkNext, formatHtml } from "./content-model";
  import { browser } from "$app/environment";
  import type { ElementName } from "./constants";
  import Card from "./Card.svelte";
  import { startMatch } from "./match";

  let match = startMatch(
    ["body", "div", "span", "a", "hr", "p", "button", "ul", "li", "br"],
    1,
  );
</script>

<pre><code>{formatHtml(match.field, 2)}</code></pre>

<ul class=" mt-8 grid auto-cols-auto grid-flow-col">
  <!-- for -->
  {#each match.players[0] as el}
    {@const ok = browser ? checkNext(match.field, el) : false}
    <li class=" w-24 transition-transform hover:z-10 hover:-translate-y-4">
      <Card
        title={el}
        description={el === "a" ? " (hrefなし)" : ""}
        onClick={() => {
          match = {
            field: [...match.field, el],
            players: [match.players[0].filter((n) => n !== el)],
          };
        }}
        disabled={!ok}
      />
    </li>
  {/each}
</ul>
