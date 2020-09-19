import { writable } from 'svelte/store';

export const initial_state = {
  playable: true,
  correctLetters: [],
  wrongLetters: [],
  selectedWord: '',
  showNotification: false,
  showPopup : false,
  message:'',
  word:''
};

export const store = writable(initial_state);
