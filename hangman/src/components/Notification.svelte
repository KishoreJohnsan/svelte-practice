<script>
  import { store } from '../store';
  import { onMount } from 'svelte';

  export let showNotification;

  $: visible = showNotification;

  const nextState = () => (state) => {
    let notif = false;
    return {
      ...state,
      showNotification: notif,
    };
  };
  const handleNotification = () => {
    if (showNotification) store.update(nextState());
  };

  function update() {
    visible = false;
    handleNotification();
    setTimeout(update, 2000);
  }

  onMount(() => {
    update();
  });
</script>

<style>
  .notification-container {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px 10px 0 0;
    padding: 15px 20px;
    position: absolute;
    bottom: -50px;
    transition: transform 0.3s ease-in-out;
  }

  .notification-container p {
    margin: 0;
  }

  .showNotification {
    transform: translateY(-50px);
  }
</style>

<div
  class="notification-container"
  id="notification-container"
  class:showNotification={visible}>
  <p>You have already entered this letter</p>
</div>
