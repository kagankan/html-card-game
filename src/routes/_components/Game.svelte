<script lang="ts">
  import htmlSpec from "@markuplint/html-spec";
  import { createSelector } from "@markuplint/selector";
  import { browser } from "$app/environment";

  // TODO: ユニオン型にしたい
  type ElementName = (typeof htmlSpec.specs)[number]["name"];
  const getContentModel = (
    elementName: ElementName,
    specs: typeof htmlSpec.specs,
  ) => {
    const name = elementName.toLowerCase();
    const spec = specs.find((s) => s.name === name);
    if (spec) {
      return spec.contentModel.contents;
    }
    return false;
  };

  let hand: ElementName[] = ["div", "span", "a", "hr", "p", "button"];
  let nesting: ElementName[] = ["body"];
  $: current = nesting[nesting.length - 1];
  $: contentModel = getContentModel(current, htmlSpec.specs);
  $: {
    console.log(JSON.stringify(contentModel, null, 4));
  }

  const getQuery = (nesting: readonly ElementName[]) => {
    // TODO: 次に受け入れるクエリを生成する
    // return nesting
    //   .map((n, i) => {
    //     if (i === 0) {
    //       return n;
    //     }
    //     return ` > ${n}`;
    //   })
    //   .join("");
  };

  const canPlay = (tagName: string): boolean => {
    // NOTE: Array.isArray だと絞り込みができずanyになってしまうのでこの判定
    if (browser && contentModel !== null && typeof contentModel !== "boolean") {
      const element = document.createElement(tagName);
      const candidates = contentModel.flatMap((model) => {
        if ("oneOrMore" in model) {
          return typeof model.oneOrMore === "string"
            ? [model.oneOrMore]
            : model.oneOrMore;
        } else if ("transparent" in model) {
          // const parent = lastElement.parentElement;
          // if (parent) {
          //   return getContentModel(parent, htmlSpec.specs);
          // } else {
          // }
          // TODO: 透過モデルの判定
          return [model.transparent];
        }
        return [];
      });
      return candidates.some((model) => {
        const result = createSelector(model, htmlSpec).match(element);
        console.log(tagName, result);
        return result !== false;
      });
    } else if (contentModel === true) {
      return true;
    }
    return false;
  };

  if (browser) {
    const sample1 = document.createElement("a");
    document.createElement("div").appendChild(sample1);
    const sample2 = document.createElement("a");
    document.createElement("span").appendChild(sample2);

    console.log(sample1.parentElement);
    // console.log(getContentModel(sample2, htmlSpec.specs));
  }
</script>

<p>{nesting.join(" > ")}</p>

<ul>
  <!-- for -->
  {#each hand as el}
    <li>
      <button
        on:click={() => {
          if (canPlay(el)) {
            nesting = [...nesting, el];
            hand = hand.filter((n) => n !== el);
          }
        }}
        disabled={!canPlay(el)}>{el === "a" ? "a (hrefなし)" : el}</button
      >
    </li>
  {/each}
</ul>

<p>※transparentのコンテンツモデルには未対応</p>
