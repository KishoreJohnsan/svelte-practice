<script>
  import Button from './components/Button.svelte';
  import {onMount } from 'svelte/internal';

  const BASE_URL = 'https://randomuser.me/api';
  let users = [];
  let totalWealth = 0;

  const calculateWealth = () => {
    totalWealth = users.reduce((total, user) => (total += user.money), 0);
  };

  const doubleMoney = () => {
    users = users.map((user) => {
      return { ...user, money: user.money * 2 };
    });
  };

  const sortByRichest = () => {
    users = users.sort((a, b) => b.money - a.money);
  };

  const showMillionaires = () => {
    users = users.filter((user) => user.money > 1000000);
  };

  const addUser = (user) => {
    users = [...users, user];
  };

  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    let userdata = data.results[0];

    let user = {
      name: `${userdata.name.first} ${userdata.name.last}`,
      money: Math.floor(Math.random() * 1000000),
    };

    addUser(user);
  };

  const formatMoney = (data) => {
    return '$' + data.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  onMount(async () => {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    let userdata = data.results[0];

    let user = {
      name: `${userdata.name.first} ${userdata.name.last}`,
      money: Math.floor(Math.random() * 1000000),
    };

    addUser(user);
  });
</script>

<style>
  main {
    background: #f4f4f4;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }

  .container {
    display: flex;
    padding: 20px;
    margin: 0 auto;
    max-width: 100%;
    width: 800px;
  }

  .container #main {
    flex: 1;
    padding: 10px 20px;
  }

  aside {
    padding: 10px 20px;
    width: 250px;
    border-right: 1px solid #111;
  }

  h2 {
    border-bottom: 1px solid #111;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-weight: 300;
    margin: 0 0 20px;
  }

  h3 {
    background-color: #fff;
    border-bottom: 1px solid #111;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    font-weight: 300;
    margin: 20px 0 0;
  }

  .person {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    margin-bottom: 10px;
  }
</style>

<main>
  <h1>DOM Array Methods</h1>

  <div class="container">
    <aside>
      <Button on:click={fetchUser}>Add User 👱‍♂️</Button>
      <Button on:click={doubleMoney}>Double Money 💰</Button>
      <Button on:click={showMillionaires}>Show Only Millionaires 💵</Button>
      <Button on:click={sortByRichest}>Sort by Richest ↓</Button>
      <Button on:click={calculateWealth}>Calculate entire Wealth 🧮</Button>
    </aside>

    <div id="main">
      <h2>
        <strong>Person</strong>
        Wealth
      </h2>

      {#each users as user}
        <div class="person">
          <strong>{user.name}</strong>
          {formatMoney(user.money)}
        </div>
      {/each}

      {#if totalWealth !== 0}
        <h3>
          Total Wealth:
          <strong>{formatMoney(totalWealth)}</strong>
        </h3>
      {/if}

    </div>
  </div>
</main>
