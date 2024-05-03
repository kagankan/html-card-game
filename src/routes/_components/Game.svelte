<script lang="ts">
  import type {ElementName } from "./game";
  import  {getContentModel, checkNext} from "./game";
import { browser } from "$app/environment";

let hand: ElementName[] = ["div", "span", "a", "hr", "p", "button"];
let nesting: ElementName[] = ["body"];
$: current = nesting[nesting.length - 1];
$: contentModel = getContentModel(current);
$: {
  console.log(JSON.stringify(contentModel, null, 4));
}
</script>

<p>{nesting.join(" > ")}</p>

<ul>
  <!-- for -->
  {#each hand as el}
  {@const ok = browser ? checkNext(nesting, el) : false}
    <li>
      <button
        on:click={() => {
            nesting = [...nesting, el];
            hand = hand.filter((n) => n !== el);
        }}
        disabled={!ok}>{el === "a" ? "a (hrefなし)" : el}</button
      >
    </li>
  {/each}
</ul>
