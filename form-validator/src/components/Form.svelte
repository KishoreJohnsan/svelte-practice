<script>
  import { createEventDispatcher } from 'svelte';
  let valid = false;
  export let userNameSuccess = false;
  export let userNameError = false;
  export let emailSuccess = false;
  export let emailError = false;
  export let pwd1Success = false;
  export let pwd1Error = false;
  export let pwd2Success = false;
  export let pwd2Error = false;

  let dispatch = createEventDispatcher();

  let fields = { username: '', email: '', password: '', password2: '' };
  let errors = { username: '', email: '', password: '', password2: '' };
  const format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const submitHandler = () => {
    valid = true;

    if (fields.username === '') {
      valid = false;
      userNameError = true;
      errors.username = 'Username is required';
    } else if (fields.username.trim().length < 5) {
      valid = false;
      userNameError = true;
      errors.username = 'Username must be at least 5 chars long';
    } else if (fields.username.trim().length > 15) {
      valid = false;
      userNameError = true;
      errors.username = 'Username must be less 15 chars long';
    } else {
      errors.username = '';
      userNameSuccess = true;
      userNameError = false;
    }

    if (fields.email === '') {
      valid = false;
      emailError = true;
      errors.email = 'Email is required';
    } else if (format.test(fields.email.trim())) {
      errors.email = '';
      emailSuccess = true;
      emailError = false;
    } else {
      valid = false;
      emailError = true;
      errors.email = 'Email is not valid';
    }

    if (fields.password === '') {
      valid = false;
      pwd1Error = true;
      errors.password = 'Password is required';
    } else if (fields.password.trim().length < 8) {
      valid = false;
      pwd1Error = true;
      errors.password = 'Password must be at least 8 chars long';
    } else if (fields.password.trim().length > 15) {
      valid = false;
      pwd1Error = true;
      errors.password = 'Password must be less 15 chars long';
    } else {
      errors.password = '';
      pwd1Success = true;
      pwd1Error = false;
    }

    if (fields.password2 === '') {
      valid = false;
      pwd2Error = true;
      errors.password2 = 'Password2 is required';
    } else if (fields.password !== fields.password2) {
      valid = false;
      pwd2Error = true;
      errors.password2 = 'Passwords do not match';
    } else {
      pwd2Error = false;
      pwd2Success = true;
      errors.password2 = '';
    }
  };
</script>

<style>
  .container {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    width: 400px;
  }

  h2 {
    text-align: center;
    margin: 0 0 20px;
  }
  .form {
    padding: 30px 40px;
  }

  .form-control.success input {
    border-color: var(--success-color);
  }

  .form-control.error input {
    border-color: var(--error-color);
  }

  .form-control {
    margin-bottom: 10px;
    padding-bottom: 20px;
    position: relative;
  }

  .form-control label {
    color: #777;
    display: block;
    margin-bottom: 5px;
  }

  .form-control input {
    border: 2px solid #f0f0f0;
    border-radius: 4px;
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .form-control input:focus {
    outline: 0;
    border-color: #777;
  }

  .form-control .error {
    color: var(--error-color);
    position: absolute;
    bottom: 0;
    left: 0;
    visibility: visible;
  }

  .form button {
    cursor: pointer;
    background-color: #3498db;
    border: 2px solid #3498db;
    border-radius: 4px;
    color: #fff;
    display: block;
    font-size: 16px;
    padding: 10px;
    margin-top: 20px;
    width: 100%;
  }
</style>

<div class="container">

  <form on:submit|preventDefault={submitHandler} class="form">
    <h2>Register With Us</h2>
    <div
      class="form-control"
      class:success={userNameSuccess}
      class:error={userNameError}>
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="Enter username"
        bind:value={fields.username} />
      <small class="error">{errors.username}</small>
    </div>
    <div
      class="form-control"
      class:success={emailSuccess}
      class:error={emailError}>
      <label for="email">Email</label>
      <input
        type="text"
        id="email"
        placeholder="Enter email"
        bind:value={fields.email} />
      <small class="error">{errors.email}</small>
    </div>
    <div
      class="form-control"
      class:success={pwd1Success}
      class:error={pwd1Error}>
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter password"
        bind:value={fields.password} />
      <small class="error">{errors.password}</small>
    </div>
    <div
      class="form-control"
      class:success={pwd2Success}
      class:error={pwd2Error}>
      <label for="password2">Confirm Password</label>
      <input
        type="password"
        id="password2"
        placeholder="Enter password again"
        bind:value={fields.password2} />
      <small class="error">{errors.password2}</small>
    </div>
    <button type="submit">Submit</button>
  </form>
</div>
