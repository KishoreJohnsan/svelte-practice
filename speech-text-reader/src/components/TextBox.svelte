<script>
  import { onMount } from 'svelte';
  import { message } from '../helper';
  let showTextBox;
  let input;
  let selected;
  let voices = [];

  const handleShowTextBox = () => {
    showTextBox = !showTextBox;
  };

  const setVoice = () => {
    message.voice = voices.find((voice) => voice.name === selected.name);
  };

  const readText = () => {
    message.text = input;
    speechSynthesis.speak(message);
  };

  const getVoices = () => {
    voices = speechSynthesis.getVoices();
  };

  speechSynthesis.addEventListener('voiceschanged', getVoices);

  onMount(() => {
    getVoices();
  });
</script>

<style>
  .btn {
    cursor: pointer;
    background-color: darksalmon;
    border: 0;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    padding: 8px;
  }

  .btn:active {
    transform: scale(0.98);
  }

  .btn:focus {
    outline: 0;
  }

  .btn-toggle {
    display: block;
    margin: auto;
    margin-bottom: 20px;
  }

  .text-box {
    width: 70%;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -800px);
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    transition: all 1s ease-in-out;
  }

  .text-box.showTextBox {
    transform: translate(-50%, 0);
  }

  .text-box select {
    background-color: darksalmon;
    border: 0;
    color: #fff;
    font-size: 12px;
    height: 30px;
    width: 100%;
  }

  .text-box textarea {
    border: 1px #dadada solid;
    border-radius: 4px;
    font-size: 16px;
    padding: 8px;
    margin: 15px 0;
    width: 100%;
    height: 150px;
  }

  .text-box .btn {
    width: 100%;
  }

  .text-box .close {
    float: right;
    text-align: right;
    cursor: pointer;
  }
</style>

<button id="toggle" class="btn btn-toggle" on:click={handleShowTextBox}>
  Toggle Text Box
</button>

<div id="text-box" class="text-box" class:showTextBox>
  <div id="close" class="close" on:click={handleShowTextBox}>X</div>
  <h3>Choose Voice</h3>
  <!-- svelte-ignore a11y-no-onchange -->
  <select id="voices" bind:value={selected} on:change={setVoice}>
    {#each voices as voice}
      <option value={voice}>{voice.name} {voice.lang}</option>
    {/each}
  </select>
  <textarea id="text" placeholder="Enter text to read..." bind:value={input} />
  <button class="btn" id="read" on:click={readText}>Read Text</button>
</div>
