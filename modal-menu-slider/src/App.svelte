<script>  
  import Main from './components/Main.svelte';
  import Nav from './components/Nav.svelte';
  import Modal from './components/Modal.svelte';
  let showModal;
  let showNav;
  const handleMenu = () => {   
    showNav = !showNav;
  };

  const handleModal = () => {
    showModal = !showModal;
  };
</script>

<style>
  main {
    font-family: 'Lato', sans-serif;
    margin: 0;
    transition: transform 0.3s ease;
  }
  .showNav {
    transform: translateX(200px);
  }

  header {
    background-color: var(--primary-color);
    color: #fff;
    font-size: 130%;
    position: relative;
    padding: 40px 15px;
    text-align: center;
  }

  header h1 {
    margin: 0;
  }

  header p {
    margin: 30px 0;
  }

  button {
    background-color: var(--secondary-color);
    border: 0;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    padding: 8px 12px;
  }

  button:focus {
    outline: none;
  }

  .toggle {
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .cta-btn {
    padding: 12px 30px;
    font-size: 20px;
  }
</style>

<main class:showNav>
  <Nav {showNav} />
  <header>
    <button id="toggle" class="toggle" on:click={handleMenu}>
      <i class="fa fa-bars fa-2x" />
    </button>
    <h1>My Landing Page</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, amet!
    </p>
    <button class="cta-btn" id="open" on:click={handleModal}>Sign Up</button>
  </header>
  <Modal {showModal} />
  <Main />
</main>
