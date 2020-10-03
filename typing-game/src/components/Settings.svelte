<script>
  export let hideSettingMenu = false;
  export let difficulty;

  const storeDifficulty = () => {
    localStorage.setItem('difficulty', difficulty);
  };
</script>

<style>
  .settings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    height: 70px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
  }

  select {
    width: 200px;
    padding: 5px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    background-color: #a7c5e3;
  }

  select:focus {
    outline: 0;
  }

  .hideSettingMenu {
    transform: translateY(-100%);
  }
</style>

<div id="settings" class="settings" class:hideSettingMenu>
  <div>
    <label for="difficulty">Difficulty</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="difficulty" bind:value={difficulty} on:change={storeDifficulty}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
  </div>
</div>
