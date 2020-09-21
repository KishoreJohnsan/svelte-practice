<script>
  import Meal from './components/Meal.svelte';

  let meal;
  let ingredients = [];
  let searchMeal;
  let searchResult;
  let resultHeading;

  const fetchRandomMeals = async () => {
    searchResult = '';
    resultHeading = '';
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php'
    );

    let data = await response.json();
    meal = data.meals[0];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  };

  const fetchMeal = async () => {
    meal = '';
    ingredients = [];
    searchResult = '';
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMeal}`
    );

    let data = await response.json();

    if (data.meals === null)
      resultHeading = 'There are no search results. Try again!';
    else {
      searchResult = data.meals;
      resultHeading = `Search results for '${searchMeal}`;
    }
  };

  const fetchMealById = async (mealId) => {
    searchResult = '';
    resultHeading = '';
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    let data = await response.json();
    meal = data.meals[0];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  };
</script>

<style>
  .container {
    margin: auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .flex {
    display: flex;
  }

  .random-btn {
    cursor: pointer;
    margin-left: 10px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  input,
  button {
    border: 1px solid #dedede;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-size: 14px;
    padding: 8px 10px;
    margin: 0;
  }

  input[type='text'] {
    width: 300px;
  }
  .search-btn {
    cursor: pointer;
    border-left: 0;
    border-radius: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .meals {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    margin-top: 20px;
  }

  .meal {
    cursor: pointer;
    position: relative;
    height: 180px;
    width: 180px;
    text-align: center;
  }

  .meal img {
    width: 100%;
    height: 100%;
    border: 4px #fff solid;
    border-radius: 2px;
  }

  .meal-info {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease-in;
    opacity: 0;
  }

  .meal:hover .meal-info {
    opacity: 1;
  }
</style>

<main>
  <div class="container">
    <h1>Meal Finder</h1>
    <div class="flex">
      <input
        type="text"
        id="search"
        placeholder="Search for meals or keywords"
        bind:value={searchMeal} />
      <button class="search-btn" on:click={fetchMeal}>
        <i class="fas fa-search" />
      </button>

      <button class="random-btn" id="random" on:click={fetchRandomMeals}>
        <i class="fas fa-random" />
      </button>
    </div>
    {#if meal}
      <Meal {meal} {ingredients} />
    {/if}
    {#if resultHeading}
      <h2>{resultHeading}</h2>
    {/if}
    {#if searchResult}
      <div id="meals" class="meals">
        {#each searchResult as meal}
          <div class="meal">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div class="meal-info" on:click={fetchMealById(meal.idMeal)}>
              <h3>{meal.strMeal}</h3>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
