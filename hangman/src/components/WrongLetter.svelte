<script>
  export let wrongLetters;
  $: letters = wrongLetters.reduce(
    (prev, curr) => (prev === null ? [curr] : [prev + ',' + curr]),
    null
  );
</script>

<style>
  .wrong-letters-container {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    text-align: right;
  }

  .wrong-letters-container p {
    margin: 0 0 5px;
  }

  .wrong-letters-container span {
    font-size: 24px;
  }
</style>

<div class="wrong-letters-container">
  <div id="wrong-letters">
    {#if wrongLetters.length > 0}
      <p>Wrong</p>
      <span>{letters}</span>      
    {/if}
  </div>
</div>
