<script>
  import { getWords } from '../helper';
  import { store, initial_state } from '../store';
  export let showPopup;
  export let message;
  export let word;

  $: showPopup = $store.showPopup;
  $: message = $store.message;
  $: word = $store.word;

  const handleClick = () => {
    store.update(() => initial_state);
    const selectedWord = getWords[
      Math.floor(Math.random() * getWords.length)
    ].toUpperCase();
    const playable = true;
    store.update(() => ({ ...initial_state, selectedWord, playable }));
  };
</script>

<style>
  .popup {
    background: #2980b9;
    border-radius: 5px;
    box-shadow: 0 15px 10px 3px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
  }

  .popup button {
    cursor: pointer;
    background-color: #fff;
    color: #2980b9;
    border: 0;
    margin-top: 20px;
    padding: 12px 20px;
    font-size: 16px;
  }

  .popup button:active {
    transform: scale(0.98);
  }

  .popup button:focus {
    outline: 0;
  }

  .popup-container {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .showPopup {
    display: flex;
  }
</style>

<div class="popup-container" class:showPopup>
  <div class="popup">
    <h2>{message}</h2>
    <h3>{word}</h3>
    <button id="play-button" on:click={handleClick}>Play Again</button>
  </div>
</div>
