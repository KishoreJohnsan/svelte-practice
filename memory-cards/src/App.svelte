<script>
  import { onMount } from 'svelte';
  import Card from './components/Card.svelte';

  let cards = [];
  let show = false;
  let question = '';
  let answer = '';
  let currentActiveCard = 0;
  let index = 0;

  const getCardsData = () => {
    let data = JSON.parse(localStorage.getItem('cards'));
    cards = data === null ? [] : data;
  };

  const handleForm = () => {
    show = !show;
  };

  const addCard = () => {
    if (question !== '' && answer !== '') {
      const newCard = { question, answer };
      cards = [...cards, newCard];

      question = '';
      answer = '';
      show = !show;
      setCardsData(cards);
    }
  };

  const setCardsData = (cards) => {
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
  };

  const nextCard = () => {
    currentActiveCard = currentActiveCard + 1;

    if (currentActiveCard > cards.length - 1)
      currentActiveCard = cards.length - 1;

    index = currentActiveCard;
  };

  const prevCard = () => {
    currentActiveCard = currentActiveCard - 1;

    if (currentActiveCard < 0) currentActiveCard = 0;

    index = currentActiveCard;
  };

  const clearStorage = () => {
    localStorage.clear();
    cards = [];
    window.location.reload();
  };

  onMount(() => {
    getCardsData();
  });
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100vh;
  }

  h1 {
    position: relative;
  }

  h1 button {
    position: absolute;
    right: 0;
    transform: translate(120%, -50%);
    z-index: 2;
  }

  .btn {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #aaa;
    border-radius: 3px;
    font-size: 14px;
    margin-top: 20px;
    padding: 10px 15px;
  }

  .btn-small {
    font-size: 12px;
    padding: 5px 10px;
  }

  .btn-ghost {
    border: 0;
    background-color: transparent;
  }

  .clear {
    position: absolute;
    bottom: 30px;
    left: 30px;
  }

  .cards {
    perspective: 1000px;
    position: relative;
    height: 300px;
    width: 500px;
    max-width: 100%;
  }

  .navigation {
    display: flex;
    margin: 20px 0;
  }

  .navigation .nav-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
  }

  .navigation p {
    margin: 0 25px;
  }

  .add-container {
    opacity: 0;
    z-index: -1;
    background-color: #f0f0f0;
    border-top: 2px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    transition: 0.3s ease;
  }

  .add-container.show {
    opacity: 1;
    z-index: 2;
  }

  .form-group label {
    display: block;
    margin: 20px 0 10px;
    text-align: left;
  }

  .form-group textarea {
    border: 1px solid #aaa;
    border-radius: 3px;
    font-size: 16px;
    padding: 12px;
    min-width: 500px;
    max-width: 100%;
  }
</style>

<main>
  <button id="clear" class="clear btn" on:click={clearStorage}>
    <i class="fas fa-trash" />
    Clear Cards
  </button>

  <h1>
    Memory Cards
    <button id="show" class="btn btn-small" on:click={handleForm}>
      <i class="fas fa-plus" />
      Add New Card
    </button>
  </h1>
  <div id="cards-container" class="cards">
    {#each [cards[index]] as card (index)}
      {#if card}
        <Card {card} />
      {/if}
    {/each}
  </div>
  <div class="navigation">
    <button id="prev" class="nav-button" on:click={prevCard}>
      <i class="fas fa-arrow-left" />
    </button>

    <p id="current">
      {#if cards.length > 0}{currentActiveCard + 1}/{cards.length}{/if}
    </p>

    <button id="next" class="nav-button" on:click={nextCard}>
      <i class="fas fa-arrow-right" />
    </button>
  </div>

  <div id="add-container" class="add-container" class:show>
    <h1>
      Add New Card
      <button id="hide" class="btn btn-small btn-ghost" on:click={handleForm}>
        <i class="fas fa-times" />
      </button>
    </h1>

    <div class="form-group">
      <label for="question">Question</label>
      <textarea
        id="question"
        placeholder="Enter question..."
        bind:value={question} />
    </div>

    <div class="form-group">
      <label for="answer">Answer</label>
      <textarea id="answer" placeholder="Enter Answer..." bind:value={answer} />
    </div>

    <button id="add-card" class="btn" on:click={addCard}>
      <i class="fas fa-plus" />
      Add Card
    </button>
  </div>
</main>
