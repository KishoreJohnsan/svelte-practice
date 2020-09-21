<script>
  export let meal;
  export let ingredients;
</script>

<style>
  .single-meal {
    margin: 30px auto;
    width: 70%;
  }

  .single-meal img {
    width: 300px;
    margin: 15px;
    border: 4px #fff solid;
    border-radius: 2px;
  }

  .single-meal-info {
    margin: 20px;
    padding: 10px;
    border: 2px #e09850 dashed;
    border-radius: 5px;
  }

  .single-meal p {
    margin: 0;
    letter-spacing: 0.5px;
    line-height: 1.5;
  }

  .single-meal ul {
    padding-left: 0;
    list-style-type: none;
  }

  .single-meal ul li {
    border: 1px solid #ededed;
    border-radius: 5px;
    background-color: #fff;
    display: inline-block;
    color: #2d2013;
    font-size: 12px;
    font-weight: bold;
    padding: 5px;
    margin: 0 5px 5px 0;
  }
</style>

<div class="single-meal">
  <h1>{meal.strMeal}</h1>
  <img src={meal.strMealThumb} alt={meal.strMeal} />
  <div class="single-meal-info">
    {#if meal.strCategory}
      <p>{meal.strCategory}</p>
    {/if}
    {#if meal.strArea}
      <p>{meal.strArea}</p>
    {/if}
  </div>
  <div class="main">
    <p>{meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
      {#each ingredients as ing}
        <li>{ing}</li>
      {/each}
    </ul>
  </div>
</div>
