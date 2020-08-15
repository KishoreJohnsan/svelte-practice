<script>
  import { seatCount } from '../Stores/seatCount.js';
  export let selected = false;
  export let occupied = false;

  const handleClick = () => {
    if (occupied) selected = false;
    else selected = !selected;
    if (selected) seatCount.update((n) => n + 1);
    else if (!occupied) seatCount.update((n) => n - 1);
  };
</script>

<style>
  .seat {
    background-color: #444451;
    height: 12px;
    width: 15px;
    margin: 3px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .seat.selected {
    background-color: #6feaf6;
  }

  .seat.occupied {
    background-color: #fff;
  }

  .seat:not(.occupied):hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .seat:nth-of-type(2) {
    margin-right: 18px;
  }

  .seat:nth-last-of-type(3) {
    margin-left: 18px;
  }
</style>

<div class="seat" class:selected class:occupied on:click={handleClick} />
