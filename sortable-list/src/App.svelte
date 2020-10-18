<script>
  let checkOrder = false;
  const richestPeople = [
    'Jeff Bezos',
    'Bill Gates',
    'Warren Buffett',
    'Bernard Arnault',
    'Carlos Slim Helu',
    'Amancio Ortega',
    'Larry Ellison',
    'Mark Zuckerberg',
    'Michael Bloomberg',
    'Larry Page',
  ];

  let peopleList = richestPeople
    .map((a) => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

  const drop = (event, target) => {
    event.dataTransfer.dropEffect = 'move';
    const start = parseInt(event.dataTransfer.getData('text/plain'));
    const tempList = peopleList;

    [tempList[start], tempList[target]] = [tempList[target], tempList[start]];

    peopleList = tempList;
  };

  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  };
  function handleCheckOrder() {
    checkOrder = true;
    setTimeout(() => {
      checkOrder = false;
    }, 1000);
  }
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
  }
  .draggable-list {
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0;
    list-style-type: none;
  }

  .draggable-list li {
    background-color: #fff;
    display: flex;
    flex: 1;
  }

  .draggable-list li:not(:last-of-type) {
    border-bottom: 1px solid var(--border-color);
  }

  .draggable-list .number {
    background-color: var(--background-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    height: 60px;
    width: 60px;
  }

  .draggable-list li.over .draggable {
    background-color: #eaeaea;
  }

  .draggable-list .person-name {
    margin: 0 20px 0 0;
  }

  .draggable {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    flex: 1;
  }

  .check-btn {
    background-color: var(--background-color);
    border: none;
    color: var(--text-color);
    font-size: 16px;
    padding: 10px 20px;
    cursor: pointer;
  }

  .check-btn:active {
    transform: scale(0.98);
  }

  .check-btn:focus {
    outline: none;
  }
</style>

<main>
  <h1>10 Richest People</h1>
  <p>Drag and drop the items into their corresponding spots</p>
  <ul class="draggable-list" id="draggable-list">
    {#each peopleList as person, index}
      <li
        on:dragstart={(event) => dragstart(event, index)}
        on:drop|preventDefault={(event) => drop(event, index)}
        ondragover="return false">
        <span class="number">{index + 1}</span>
        <div
          class="draggable"
          draggable="true"
          style="color: {checkOrder ? (person !== richestPeople[index] ? '#ff3838' : '#3ae374') : '#000'} ">
          <p class="person-name">{person}</p>
          <i class="fas fa-grip-lines" />
        </div>
      </li>
    {/each}
  </ul>
  <button class="check-btn" id="check" on:click={handleCheckOrder}>
    Check Order
    <i class="fas fa-paper-plane" />
  </button>
</main>
