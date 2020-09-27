<script>
  import { prevent_default } from 'svelte/internal';
  import { onMount } from 'svelte';

  let description = '';
  let amount = '';
  let transactions = [];
  let finalBalance = '$0.00';
  let finalIncome = '$0.00';
  let finalExpense = '$0.00';

  const generateID = () => {
    return Math.floor(Math.random() * 100000000);
  };

  const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
  };
  const addTransaction = () => {
    if (description === '' || amount === '')
      alert('Please add a text and amount');
    else if (!isNumeric(amount)) alert('Amount should be a number');
    else {
      const transaction = {
        id: generateID(),
        description: description,
        amount: +amount,
      };

      transactions = [...transactions, transaction];
      updateLocalStorage();
      updateValues();

      description = '';
      amount = '';
    }
  };

  const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  const updateValues = () => {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);

    const expense = (
      amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    finalBalance = total;
    finalIncome = income;
    finalExpense = expense;
  };

  const removeTransaction = (id) => {
    transactions = transactions.filter((transaction) => transaction.id !== id);

    updateLocalStorage();
    updateValues();
  };

  const getValueFromLocalStorage = () => {
    transactions =
      localStorage.getItem('transactions') !== null
        ? JSON.parse(localStorage.getItem('transactions'))
        : [];
  };

  onMount(() => {
    getValueFromLocalStorage();
    updateValues();
  });
</script>

<style>
  main {
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    font-family: 'Lato', sans-serif;
  }

  .container {
    margin: 30px auto;
    width: 350px;
  }

  h1 {
    letter-spacing: 1px;
    margin: 0;
  }

  h3 {
    border-bottom: 1px solid #bbb;
    padding-bottom: 10px;
    margin: 40px 0 10px;
  }

  h4 {
    margin: 0;
    text-transform: uppercase;
  }

  .inc-exp-container {
    background-color: #fff;
    box-shadow: var(--box-shadow);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  .inc-exp-container > div {
    flex: 1;
    text-align: center;
  }

  .inc-exp-container > div:first-of-type {
    border-right: 1px solid #dedede;
  }

  .money {
    font-size: 20px;
    letter-spacing: 1px;
    margin: 5px 0;
  }

  .money.plus {
    color: #2ecc71;
  }

  .money.minus {
    color: #c0392b;
  }

  label {
    display: inline-block;
    margin: 10px 0;
  }

  input[type='text'],
  input[type='number'] {
    border: 1px solid #dedede;
    border-radius: 2px;
    display: block;
    font-size: 16px;
    padding: 10px;
    width: 100%;
  }

  .btn {
    cursor: pointer;
    background-color: #9c88ff;
    box-shadow: var(--box-shadow);
    color: #fff;
    border: 0;
    display: block;
    font-size: 16px;
    margin: 10px 0 30px;
    padding: 10px;
    width: 100%;
  }

  .btn:focus,
  .delete-btn:focus {
    outline: 0;
  }

  .list {
    list-style-type: none;
    padding: 0;
    margin-bottom: 40px;
  }

  .list li {
    background-color: #fff;
    box-shadow: var(--box-shadow);
    color: #333;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 10px;
    margin: 10px 0;
  }

  .list li.plus {
    border-right: 5px solid #2ecc71;
  }

  .list li.minus {
    border-right: 5px solid #c0392b;
  }
  .list li:hover .delete-btn {
    opacity: 1;
  }

  .delete-btn {
    cursor: pointer;
    background-color: #e74c3c;
    border: 0;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    padding: 2px 5px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
</style>

<main>
  <h2>Expense Tracker</h2>

  <div class="container">
    <h4>Your Balance</h4>
    <h1 id="balance">${finalBalance}</h1>
    <div class="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p id="money-plus" class="money plus">${finalIncome}</p>
      </div>
      <div>
        <h4>Expense</h4>
        <p id="money-minus" class="money minus">${finalExpense}</p>
      </div>
    </div>

    <h3>History</h3>
    <ul id="list" class="list">
      {#each transactions as transaction}
        <li
          class:plus={transaction.amount > 0}
          class:minus={transaction.amount < 0}>
          {transaction.description}<span>{transaction.amount > 0 ? '+' : '-'}{Math.abs(transaction.amount)}</span>
          <button
            class="delete-btn"
            on:click={removeTransaction(transaction.id)}>x</button>
        </li>
      {/each}
    </ul>
    <h3>Add new transaction</h3>

    <div class="form-control">
      <label for="text">Text</label>
      <input
        type="text"
        id="text"
        placeholder="Enter text..."
        bind:value={description} />
    </div>
    <div class="form-control">
      <label for="amount">Amount <br /> (negative - expense, positive - income)</label>
      <input
        type="number"
        id="amount"
        placeholder="Enter amount..."
        bind:value={amount} />
    </div>
    <button class="btn" on:click={addTransaction || prevent_default}>Add
      transaction</button>
  </div>
</main>
