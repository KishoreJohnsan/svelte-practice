<script>
  import TextBox from './components/TextBox.svelte';
  import Box from './components/Box.svelte';
  import { data } from './helper';
</script>

<style>
  main {
    min-height: 100vh;
    margin: 0;
  }

  h1 {
    text-align: center;
  }

  .container {
    margin: auto;
    padding: 20px;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
  }

  @media (max-width: 1100px) {
    .content {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 760px) {
    .content {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 500px) {
    .content {
      grid-template-columns: 1fr;
    }
  }
</style>

<main>
  <div class="container">
    <h1>Speech Text Reader</h1>

    <TextBox />
    <div class="content">
      {#each data as dataItem}
        <Box {dataItem} />
      {/each}
    </div>
  </div>
</main>
