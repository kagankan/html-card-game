<script>
  import Counter from "./_components/Counter.svelte";
  import welcome from "$lib/images/svelte-welcome.webp";
  import welcome_fallback from "$lib/images/svelte-welcome.png";
  import Card from "./_components/Card.svelte";
  import Game from "./_components/Game.svelte";

  import { base } from "$app/paths";
</script>

<svelte:head>
  <title>HTML 大富豪（ベータ）</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Game />
<section>
  <a hidden href="{base}/how-to-play">遊び方</a>

  <!-- <Card title="test" description="test description" /> -->
  <!-- <Counter /> -->
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
