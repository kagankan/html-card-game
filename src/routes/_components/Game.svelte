<script lang="ts">
  let current = 3;
  let hand = [1, 2, 3, 4, 5];
  const canPlay = (number: number) => {
    return number > current;
  };
</script>

<p>{current}</p>

<ul>
  <!-- for -->
  {#each hand as number}
    <li>
      <button
        on:click={() => {
          if (canPlay(number)) {
            current = number;
            hand = hand.filter((n) => n !== number);
          }
        }}
        disabled={!canPlay(number)}>{number}</button
      >
    </li>
  {/each}
</ul>
