<script>
  export let showModal = false;
  const handleModal = () => {
    showModal = !showModal;
  };
</script>

<style>
  .modal-container.showModal {
    display: block;
  }
  .modal-container {
    background-color: rgba(0, 0, 0, 0.6);
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .modal {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: absolute;
    overflow: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    width: 400px;
    animation-name: modalopen;
    animation-duration: var(--modal-duration);
  }

  .modal-header {
    background: var(--primary-color);
    color: #fff;
    padding: 15px;
  }

  .modal-header h3 {
    margin: 0;
    border-bottom: 1px solid #333;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-form div {
    margin: 15px 0;
  }

  .modal-form label {
    display: block;
    margin-bottom: 5px;
  }

  .modal-form .form-input {
    padding: 8px;
    width: 100%;
  }

  .close-btn {
    background: transparent;
    font-size: 25px;
    position: absolute;
    top: 0;
    right: 0;
  }

  @keyframes modalopen {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  button,
  input[type='submit'] {
    background-color: var(--secondary-color);
    border: 0;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    padding: 8px 12px;
  }
</style>

<div class="modal-container" id="modal" class:showModal>
  <div class="modal">
    <button class="close-btn" id="close" on:click={handleModal}>
      <i class="fa fa-times" />
    </button>
    <div class="modal-header">
      <h3>Sign Up</h3>
    </div>
    <div class="modal-content">
      <p>Register with us to get offers, support and more</p>
      <form class="modal-form">
        <div>
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            class="form-input" />
        </div>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            class="form-input" />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            class="form-input" />
        </div>
        <div>
          <label for="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            placeholder="Confirm Password"
            class="form-input" />
        </div>
        <input type="submit" value="Submit" class="submit-btn" />
      </form>
    </div>
  </div>
</div>
