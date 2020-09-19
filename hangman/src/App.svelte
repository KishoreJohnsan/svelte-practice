<script>
  import Header from './components/Header.svelte';
  import Figure from './components/Figure.svelte';
  import Notification from './components/Notification.svelte';
  import Popup from './components/Popup.svelte';
  import Word from './components/Word.svelte';
  import WrongLetter from './components/WrongLetter.svelte';
  import { store, initial_state } from './store';
  import { onMount } from 'svelte';
  import { isEqual, getWords } from './helper';

  $: selectedWord = $store.selectedWord;
  $: correctLetters = $store.correctLetters;
  $: wrongLetters = $store.wrongLetters;
  $: showNotification = $store.showNotification;
  $: playable = $store.playable;
  $: showPopup = $store.showPopup;
  $: message = $store.message;
  $: word = $store.word;

  const chooseWord = () => {
    store.update(() => initial_state);
    const selectedWord = getWords[
      Math.floor(Math.random() * getWords.length)
    ].toUpperCase();
    const playable = true;
    store.update(() => ({ ...initial_state, selectedWord, playable }));
  };

  const nextState = (letter) => (state) => {
    if (letter.length === 1 && /^[a-z]+$/i.test(letter)) {
      if (state.selectedWord.includes(letter)) {
        if (!state.correctLetters.includes(letter)) {
          let correctLetters = [...state.correctLetters, letter];
          if (isEqual(state.selectedWord, correctLetters)) {
            return {
              ...state,
              correctLetters: correctLetters,
              playable: false,
              showPopup: true,
              message: 'Congratulations! You won! 😃',
              word: '',
            };
          } else {
            return {
              ...state,
              correctLetters: correctLetters,
            };
          }
        } else {
          showNotification = true;
          return {
            ...state,
            showNotification: showNotification,
          };
        }
      } else {
        if (!state.wrongLetters.includes(letter)) {
          let wrongLetters = [...state.wrongLetters, letter];
          if (wrongLetters.length === 6) {
            return {
              ...state,
              wrongLetters: wrongLetters,
              playable: false,
              showPopup: true,
              message: 'Unfortunately you lost. 😕',
              word: `the word was ${selectedWord}`,
            };
          } else {
            return {
              ...state,
              wrongLetters: wrongLetters,
            };
          }
        } else {
          showNotification = true;
          return {
            ...state,
            showNotification: showNotification,
          };
        }
      }
    } else {
      return {
        ...state,
        state,
      };
    }
  };

  const onChooseLetter = (letter) => {
    if (playable) store.update(nextState(letter));
  };
  onMount(chooseWord);
</script>

<style>
  main {
    background-color: #34495e;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80vh;
    margin: 0;
    overflow: hidden;
  }

  .game-container {
    padding: 20px 30px;
    position: relative;
    margin: auto;
    height: 350px;
    width: 450px;
  }
</style>

<svelte:body on:keydown={(e) => onChooseLetter(e.key.toUpperCase())} />

<main>
  <Header />
  <div class="game-container">
    <Figure {wrongLetters} />
    <Word {selectedWord} {correctLetters} />
    <WrongLetter {wrongLetters} />
  </div>
  <Popup {showPopup} {message} {word} />
  <Notification {showNotification} />
</main>
