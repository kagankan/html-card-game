<script lang="ts">
  import htmlSpec from "@markuplint/html-spec";
  import { createSelector } from "@markuplint/selector";
  import { browser } from "$app/environment";
  import type { PermittedContentPattern } from "@markuplint/ml-spec";

  // TODO: ユニオン型にしたい
  type ElementName = (typeof htmlSpec.specs)[number]["name"];

  const getContentModel = (elementName: ElementName) => {
    const name = elementName.toLowerCase();
    const spec = htmlSpec.specs.find((s) => s.name === name);
    return spec?.contentModel.contents;
  };

  let hand: ElementName[] = ["div", "span", "a", "hr", "p", "button"];
  let nesting: ElementName[] = ["body"];
  $: current = nesting[nesting.length - 1];
  $: contentModel = getContentModel(current);
  $: {
    console.log(JSON.stringify(contentModel, null, 4));
  }

  /** transparentの計算のための親のクエリ */
  let lastQuery: string = "*";
  $: {
    console.log("lastQuery", lastQuery);
  }

  function isStringArray(
    arr: readonly unknown[],
  ): arr is string[] | readonly string[] {
    return arr.every((item) => typeof item === "string");
  }

  // TODO: a > div > p > button が禁止されない aの子要素ルールが判定できてない
  const flattenContentPattern = (
    model: (typeof htmlSpec.specs)[number]["contentModel"]["contents"],
  ): string[] => {
    if (model === true) {
      return ["*"];
    } else if (model === false) {
      return [":not(*)"];
    } else {
      return model.flatMap((m) => {
        if ("oneOrMore" in m) {
          if (typeof m.oneOrMore === "string") {
            return [m.oneOrMore];
          } else if (isStringArray(m.oneOrMore)) {
            return m.oneOrMore;
          } else {
            return flattenContentPattern(m.oneOrMore);
          }
        } else if ("transparent" in m) {
          return [`:is(${lastQuery}):is(${m.transparent})`];
        }
        return [];
      });
    }
  };

  const checkNext = (
    tagName: string,
  ): { ok: false } | { ok: true; queries: string[] } => {
    if (!browser || contentModel == null) return { ok: false };
    const candidates = flattenContentPattern(contentModel);
    const element = document.createElement(tagName);
    const queries = candidates.filter((model) => {
      const result = createSelector(model, htmlSpec).match(element);
      return result !== false;
    });
    if (queries.length === 0) return { ok: false };
    console.log(tagName, queries);
    return { ok: true, queries: queries };
  };
</script>

<p>{nesting.join(" > ")}</p>

<ul>
  <!-- for -->
  {#each hand as el}
    <li>
      <button
        on:click={() => {
          const result = checkNext(el);
          if (result.ok) {
            if (result.queries.length > 1) {
              // TODO: 2個以上になるケースがあるか検討
              console.error(result.queries);
            } else {
              lastQuery = result.queries[0];
            }
            nesting = [...nesting, el];
            hand = hand.filter((n) => n !== el);
          }
        }}
        disabled={!checkNext(el).ok}>{el === "a" ? "a (hrefなし)" : el}</button
      >
    </li>
  {/each}
</ul>

<p>※transparentのコンテンツモデルには未対応</p>
