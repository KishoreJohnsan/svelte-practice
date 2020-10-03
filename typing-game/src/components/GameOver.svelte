<script>
  export let score;
  export let showGameOver;
</script>

<style>
  .end-game-container {
    background-color: inherit;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .showGameOver {
    display: flex;
  }

  button {
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
    padding: 5px 15px;
  }

  button:focus {
    outline: 0;
  }
</style>

<div id="end-game-container" class="end-game-container" class:showGameOver>
  <h1>Time ran out</h1>
  <p>Your final score is {score}</p>
  <button onclick="location.reload()">Reload</button>
</div>
