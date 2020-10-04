<script>
  import { message } from '../helper';
  export let dataItem = {};
  let active = false;

  const readText = (input) => {
    message.text = input;
    speechSynthesis.speak(message);

    active = true;
    setTimeout(() => (active = false), 800);
  };
</script>

<style>
  .box {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow 0.2s ease-out;
  }

  .box.active {
    box-shadow: 0 0 10px 5px darksalmon;
  }

  .box img {
    width: 100%;
    object-fit: cover;
    height: 200px;
  }

  .box .info {
    background-color: darksalmon;
    color: #fff;
    font-size: 18px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    padding: 10px;
    text-align: center;
    height: 100%;
  }
</style>

<div class="box" class:active on:click={readText(dataItem.text)}>
  <img src={dataItem.image} alt={dataItem.text} />
  <p class="info">{dataItem.text}</p>
</div>
