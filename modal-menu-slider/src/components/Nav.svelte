<script>
  export let showNav = false;
</script>

<style>
  nav {
    background-color: var(--primary-color);
    border-right: 2px solid rgba(200, 200, 200, 0.1);
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    z-index: 100;
    transform: translateX(-100%);
  }

  nav .logo {
    padding: 30px 0;
    text-align: center;
  }

  nav .logo img {
    height: 75px;
    width: 75px;
    border-radius: 50%;
  }

  nav ul {
    padding: 0;
    list-style-type: none;
    margin: 0;
  }

  nav ul li {
    border-bottom: 2px solid rgba(200, 200, 200, 0.1);
    padding: 20px;
  }

  nav ul li:first-of-type {
    border-top: 2px solid rgba(200, 200, 200, 0.1);
  }

  nav ul li a {
    color: #fff;
    text-decoration: none;
  }

  nav ul li a:hover {
    text-decoration: underline;
  }

</style>

<nav id="navbar" class:showNav>
  <div class="logo">
    <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="user" />
  </div>
  <ul>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li>
      <a href="#">Home</a>
    </li>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li>
      <a href="#">Portfolio</a>
    </li>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li>
      <a href="#">Blog</a>
    </li>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li>
      <a href="#">Contact Me</a>
    </li>
  </ul>
</nav>
