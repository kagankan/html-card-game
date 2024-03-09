<script lang="ts">
  import htmlSpec from "@markuplint/html-spec";
  import { getContentModel } from "@markuplint/ml-spec";
  import { createSelector } from "@markuplint/selector";
  import { browser } from "$app/environment";

  let current = "body";
  let hand = ["div", "span", "a", "br", "p"];
  $: contentModel = browser
    ? getContentModel(document.createElement(current), htmlSpec.specs)
    : null;
  $: {
    console.log(contentModel);
  }

  const canPlay = (tagName: string): boolean => {
    if (browser) {
      const element = document.createElement(tagName);
      if (Array.isArray(contentModel)) {
        return (
          createSelector(contentModel[0].oneOrMore, htmlSpec).match(element) !==
          false
        );
      }
    }
    return tagName > current;
  };

  if (browser) {
    const sample1 = document.createElement("a");
    document.createElement("div").appendChild(sample1);
    const sample2 = document.createElement("a");
    document.createElement("span").appendChild(sample2);
    // console.log(getContentModel(sample1, htmlSpec.specs));
    // console.log(getContentModel(sample2, htmlSpec.specs));
  }
</script>

<p>{current}</p>

<ul>
  <!-- for -->
  {#each hand as el}
    <li>
      <button
        on:click={() => {
          if (canPlay(el)) {
            current = el;
            hand = hand.filter((n) => n !== el);
          }
        }}
        disabled={!canPlay(el)}>{el}</button
      >
    </li>
  {/each}
</ul>
