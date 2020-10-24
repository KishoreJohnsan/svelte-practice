<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  let limit = 5;
  let page = 1;
  let data = [];
  let newData = [];
  let filter = '';
  let posts = [];
  let loading = false;

  $: {
    if (filter.length > 0) filterPosts();    
  }

  const getPosts = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );

    data = await res.json();
    posts = data;
  };

  const getNewPosts = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );

	  newData = await res.json();
	  data = [...data,...newData];
    posts = data;
  };

  const filterPosts = () => {
    const filteredPosts = data.filter((post) => {
      return post.title.indexOf(filter) > -1 || post.body.indexOf(filter) > -1;
    });

    posts = filteredPosts;
  };

  const handleLoading = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollHeight - scrollTop === clientHeight) {
      showLoading();
    }
  };

  const showLoading = () => {
    loading = true;

    setTimeout(() => {
      loading = false;

      setTimeout(() => {
        page++;
        getNewPosts();
      }, 300);
    }, 1000);
  };

  onMount(() => {
    getPosts();
  });

  onDestroy(() => {
    data = [];
    newData = [];
  });
</script>

<style>
  main {
    background-color: #296ca8;
    color: #fff;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding-bottom: 100px;
  }

  h1 {
    margin-bottom: 0;
    text-align: center;
  }

  .filter-container {
    margin-top: 20px;
    width: 80vw;
    max-width: 800px;
  }

  .filter {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }

  .post {
    position: relative;
    background-color: #4992d3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    padding: 20px;
    margin: 40px 0;
    display: flex;
    width: 80vw;
    max-width: 800px;
  }

  .post .post-title {
    margin: 0;
  }

  .post .post-body {
    margin: 15px 0 0;
    line-height: 1.3;
  }

  .post .post-info {
    margin-left: 20px;
  }

  .post .number {
    position: absolute;
    top: -15px;
    left: -15px;
    font-size: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: #296ca8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
  }

  .loader {
    opacity: 0;
    display: flex;
    position: fixed;
    bottom: 50px;
    transition: opacity 0.3s ease-in;
  }

  .loading {
    opacity: 1;
  }

  .circle {
    background-color: #fff;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 5px;
    animation: bounce 0.5s ease-in infinite;
  }

  .circle:nth-of-type(2) {
    animation-delay: 0.1s;
  }

  .circle:nth-of-type(3) {
    animation-delay: 0.2s;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-10px);
    }
  }
</style>

<svelte:window on:scroll={handleLoading} />

<main>
  <h1>My Blog</h1>
  <div class="filter-container">
    <input
      type="text"
      id="filter"
      class="filter"
      placeholder="Filter posts..."
      on:input={filterPosts}
      bind:value={filter} />
  </div>

  <div id="posts-container">
    {#each posts as post}
      <div class="post">
        <div class="number">{post.id}</div>
        <div class="post-info">
          <h2 class="post-title">{post.title}</h2>
          <p class="post-body">{post.body}</p>
        </div>
      </div>
    {/each}
  </div>

  <div class="loader" class:loading>
    <div class="circle" />
    <div class="circle" />
    <div class="circle" />
  </div>
</main>
