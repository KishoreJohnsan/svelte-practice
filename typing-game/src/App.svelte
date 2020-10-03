<script>
  import { onMount } from 'svelte';
  import Settings from './components/Settings.svelte';
  import Time from './components/Time.svelte';
  import Score from './components/Score.svelte';
  import GameOver from './components/GameOver.svelte';
  import { words } from './helper';

  let hideSettingMenu = false;
  let text = '';
  let time = 10;
  let score = 0;
  let showGameOver = false;
  let input = '';
  let difficulty;

  $: {
    if (input.length > 0) checkText();
  }

  const checkText = () => {
    if (text === input) {
      getRandomWord();
      updateScore();
      input = '';

      if (difficulty === 'hard') {
        time += 2;
      } else if (difficulty === 'medium') {
        time += 3;
      } else {
        time += 5;
      }
    }
  };

  const updateScore = () => {
    score++;
  };

  const handleSettingsBtn = () => {
    hideSettingMenu = !hideSettingMenu;
  };

  const getRandomWord = () => {
    text = words[Math.floor(Math.random() * words.length)];
  };

  const updateTime = () => {
    time--;

    if (time === 0) {
      clearInterval(timeInterval);
      showGameOver = true;
    }
  };

  const timeInterval = setInterval(updateTime, 1000);

  onMount(() => {
    getRandomWord();
    difficulty =
      localStorage.getItem('difficulty') !== null
        ? localStorage.getItem('difficulty')
        : 'medium';
  });
</script>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
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

  .settings-btn {
    position: absolute;
    bottom: 30px;
    left: 30px;
  }

  .container {
    background-color: #34495e;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    color: #fff;
    position: relative;
    text-align: center;
    width: 500px;
  }

  h2 {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 8px;
    border-radius: 4px;
    margin: 0 0 40px;
  }

  h1 {
    margin: 0;
  }

  input {
    border: 0;
    border-radius: 4px;
    font-size: 14px;
    width: 300px;
    padding: 12px 20px;
    margin-top: 10px;
  }
</style>

<main>
  <button id="settings-btn" class="settings-btn" on:click={handleSettingsBtn}>
    <i class="fas fa-cog" />
  </button>
  <Settings {hideSettingMenu} {difficulty} />
  <div class="container">
    <h2>👩‍💻 Speed Typer 👨‍💻</h2>
    <small>Type the following:</small>

    <h1 id="word">{text}</h1>

    <!-- svelte-ignore a11y-autofocus -->
    <input
      type="text"
      id="text"
      autocomplete="off"
      placeholder="Type the word here..."
	  autofocus 
	  bind:value={input}/>

    <Time {time} />
    <Score {score} />
    <GameOver {score} {showGameOver} />
  </div>
</main>
