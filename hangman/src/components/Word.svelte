<script>
  export let selectedWord;
  export let correctLetters;

  $: maskedWord = maskWord(selectedWord, correctLetters);

  const maskWord = (word, letters) =>
    Array.from(word)
      .map((letter) => (letters.includes(letter) ? letter : ' - '))
      .join('');
</script>

<style>
  .word {
    position: absolute;
    bottom: 10px;
    left: 50%;
    height: 50px;
    width: 250px;
    transform: translateX(-50%);
  }

  .letter {
    font-size: 30px;
    align-items: center;
    justify-content: center;
    margin: 0 3px;
    height: 50px;
    width: 500px;
  }
</style>

<div class="word" id="word"><span class="letter">{maskedWord}</span></div>
