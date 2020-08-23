<script>
  import { onMount } from 'svelte';

  let currencies = [
    `AED`,
    `ARS`,
    `AUD`,
    `BGN`,
    `BRL`,
    `BSD`,
    `CAD`,
    `CHF`,
    `CLP`,
    `CNY`,
    `COP`,
    `CZK`,
    `DKK`,
    `DOP`,
    `EGP`,
    `EUR`,
    `FJD`,
    `GBP`,
    `GTQ`,
    `HKD`,
    `HRK`,
    `HUF`,
    `IDR`,
    `ILS`,
    `INR`,
    `ISK`,
    `JPY`,
    `KRW`,
    `KZT`,
    `MVR`,
    `MXN`,
    `MYR`,
    `NOK`,
    `NZD`,
    `PAB`,
    `PEN`,
    `PHP`,
    `PKR`,
    `PLN`,
    `PYG`,
    `RON`,
    `RUB`,
    `SAR`,
    `SEK`,
    `SGD`,
    `THB`,
    `TRY`,
    `TWD`,
    `UAH`,
    `USD`,
    `UYU`,
    `ZAR`,
  ];

  const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';
  let exchangeRates = [];
  let currentRate = 0;
  let amount = 1;
  let from = 'USD';
  let to = 'INR';

  let convertedAmount;
  $: convertedAmount = (amount * currentRate).toFixed(2);

  const fetchRates = async (from, to) => {
    const res = await fetch(`${BASE_URL}${from}`);
    const data = await res.json();
    exchangeRates = data.rates;
    currentRate = exchangeRates[to];
  };

  const handleSwap = () => {
    [from, to] = [to, from];
    fetchRates(from, to);
  };

  const handleChange = () => {
    fetchRates(from, to);
  };

  onMount(async () => {
    const res = await fetch(`${BASE_URL}${from}`);
    const data = await res.json();
    exchangeRates = data.rates;
    currentRate = exchangeRates[to];
  });
</script>

<style>
  .rate {
    color: var(--primary-color);
    font-size: 14px;
  }

  h1 {
    color: var(--primary-color);
  }

  p {
    text-align: center;
  }

  .btn {
    color: #fff;
    background: var(--primary-color);
    cursor: pointer;
    border-radius: 5px;
    font-size: 12px;
    padding: 5px 12px;
  }

  .money-img {
    width: 150px;
  }
  .currency {
    padding: 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .currency input {
    border: 0;
    background: transparent;
    font-size: 30px;
    text-align: right;
  }

  .swap-rate-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  select:focus,
  input:focus,
  button:focus {
    outline: 0;
  }

  @media (max-width: 600px) {
    .currency input {
      width: 200px;
    }
  }

  main {
    background-color: #f4f4f4;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    padding: 20px;
  }

  select {
    padding: 10px 20px 10px 10px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid #dedede;
    font-size: 16px;
    background: transparent;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%20000002%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-position: right 10px top 50%, 0, 0;
    background-size: 12px auto, 100%;
    background-repeat: no-repeat;
  }
</style>

<main>
  <img src="img/money.png" alt="" class="money-img" />
  <h1>Exchange Rate Calculator</h1>
  <p>Choose the currency and the amounts to get the exchange rate</p>

  <div class="container">
    <div class="currency">
      <!-- svelte-ignore a11y-no-onchange -->
      <select bind:value={from} on:change={handleChange}>
        <option value={from}>{from}</option>
        {#each currencies as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
      <input
        type="number"
        id="amount-one"
        placeholder="0"
        bind:value={amount} />
    </div>

    <div class="swap-rate-container">
      <button class="btn" id="swap" on:click={handleSwap}>Swap</button>
      <div class="rate" id="rate">1 {from} = {exchangeRates[to]} {to}</div>
    </div>

    <div class="currency">
      <!-- svelte-ignore a11y-no-onchange -->
      <select bind:value={to} on:change={handleChange}>
        <option value={to}>{to}</option>
        {#each currencies as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
      <input
        type="number"
        id="amount-two"
        placeholder="0"
        value={convertedAmount} />
    </div>

  </div>

</main>
