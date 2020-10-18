<script>
  import { onMount } from 'svelte';
  let year;
  let days = '00';
  let hours = '00';
  let minutes = '00';
  let seconds = '00';

  let loading;
  let countdown;

  const currentYear = new Date().getFullYear();
  const newYearTime = new Date(`January 01 ${currentYear + 1} 00:00:00`);
  year = currentYear + 1;

  const updateCountdown = () => {
    const currentTime = new Date();
    const diff = newYearTime - currentTime;

    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;

    days = d;
    hours = h < 10 ? '0' + h : h;
    minutes = m < 10 ? '0' + m : m;
    seconds = s < 10 ? '0' + s : s;
  };

  setTimeout(() => {
    loading = false;
    countdown = true;
  }, 1000);

  setInterval(updateCountdown, 1000);

  onMount(() => {
    loading = true;
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
    font-size: 60px;
    margin: -80px 0 40px;
  }

  .year {
    font-size: 200px;
    z-index: -1;
    opacity: 0.2;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .countdown {    
    transform: scale(2);
  }

  .time {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 15px;
  }

  .time h2 {
    margin: 0 0 5px;
  }

  @media (max-width: 500px) {
    h1 {
      font-size: 45px;
    }

    .time {
      margin: 5px;
    }

    .time h2 {
      font-size: 12px;
      margin: 0;
    }

    .time small {
      font-size: 10px;
    }
  }
</style>

<main>
  <div id="year" class="year">{year}</div>

  <h1>New Year Countdown</h1>

  <div
    id="countdown"
    class="countdown"
    style="display: {countdown ? 'flex' : 'none'}">
    <div class="time">
      <h2 id="days">{days}</h2>
      <small>days</small>
    </div>
    <div class="time">
      <h2 id="hours">{hours}</h2>
      <small>hours</small>
    </div>
    <div class="time">
      <h2 id="minutes">{minutes}</h2>
      <small>minutes</small>
    </div>
    <div class="time">
      <h2 id="seconds">{seconds}</h2>
      <small>seconds</small>
    </div>
  </div>

  {#if loading}
    <img src="./img/spinner.gif" alt="Loading..." id="loading" />
  {/if}
</main>
