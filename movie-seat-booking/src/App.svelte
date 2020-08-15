<script>
  import Seat from './components/Seat.svelte';
  import Screen from './components/Screen.svelte';
  import Desc from './components/Desc.svelte';
  import { seatCount } from './Stores/seatCount.js';

  let count_value;
  let selected;

  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  const unsubscribe = seatCount.subscribe((value) => {
    count_value = value;
  });

  let tickets = [
    { price: 10, movieName: `Avengers: Endgame ($10)` },
    { price: 12, movieName: `Joker ($12)` },
    { price: 8, movieName: `Toy Story 4 ($8)` },
    { price: 9, movieName: `The Lion King ($9)` },
  ];
</script>

<style>
  .container {
    perspective: 1000px;
    margin-bottom: 30px;
  }
  .row {
    display: flex;
  }
  p.text {
    margin: 5px 0;
  }

  p.text span {
    color: #6feaf6;
  }
  .movie-container {
    margin: 20px 0;
  }

  .movie-container select {
    background-color: #fff;
    border: 0;
    border-radius: 5px;
    font-size: 14px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }
</style>

<main>
  <div class="movie-container">
    <label for="movie">Pick a movie:</label>
    <select id="movie" bind:value={selected}>
      {#each tickets as ticket}
        <option value={ticket}>{ticket.movieName}</option>
      {/each}
    </select>
  </div>
  <Desc />
  <div class="container">
    <Screen />
    <div class="row">
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />

    </div>
    <div class="row">
      <Seat />
      <Seat />
      <Seat />
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
    </div>
    <div class="row">
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
    </div>
    <div class="row">
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat occupied="true" />
      <Seat occupied="true" />

    </div>
    <div class="row">
      <Seat />
      <Seat />
      <Seat />
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
    </div>
    <div class="row">
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat occupied="true" />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
      <Seat />
    </div>
  </div>

  <p class="text">
    You have selected
    <span id="count">{count_value}</span>
    seats for a price of $
    <span id="total">
      {selected ? selected.price * count_value : '[calculating...]'}
    </span>
  </p>
</main>
