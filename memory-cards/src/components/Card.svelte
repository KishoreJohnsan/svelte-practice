<script>
  import { fade } from 'svelte/transition';
  export let card;
  let showAnswer = false;

  const handleCardFlip = () => {
    showAnswer = !showAnswer;
  };
</script>

<style>
  .card {
    position: absolute;
    opacity: 0;
    font-size: 1.5em;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform: translateX(50%) rotateY(-10deg);
    transition: transform 0.4s ease, opacity 0.4s ease;
  }

  .card.active {
    cursor: pointer;
    opacity: 1;
    z-index: 10;
    transform: translateX(0) rotateY(0deg);
  }

  .inner-card {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    height: 100%;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
  }

  .card.showAnswer .inner-card {
    transform: rotateX(180deg);
  }

  .inner-card-front,
  .inner-card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: #fff;
  }

  .inner-card-front {
    transform: rotateX(0deg);
    z-index: 2;
  }

  .inner-card-back {
    transform: rotateX(180deg);
  }

  .inner-card-front::after,
  .inner-card-back::after {
    content: '\f021  Flip';
    font-family: 'Font Awesome 5 Free', Lato, sans-serif;
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: bold;
    font-size: 16px;
    color: #ddd;
  }
</style>

<div
  class="card active"
  transition:fade
  class:showAnswer
  on:click={handleCardFlip}>
  <div class="inner-card">
    <div class="inner-card-front">
      <p>{card.question}</p>
    </div>
    <div class="inner-card-back">
      <p>{card.answer}</p>
    </div>
  </div>
</div>
