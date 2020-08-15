<script>
import Seat from './Seat.svelte'
</script>

<style>
  .showcase {
    background: rgba(0, 0, 0, 0.1);
    padding: 5px 22.8px;
    border-radius: 5px;
    color: #777;
    list-style-type: none;
    display: flex;
    justify-content: space-between;
  }

  .showcase li {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
  }

  .showcase li small {
    margin-left: 2px;
  }
</style>

<ul class="showcase">
  <li>
    <Seat/>
    <small>N/A</small>
  </li>
  <li>
    <Seat selected=true/>
    <small>Selected</small>
  </li>
  <li>
    <Seat occupied=true/>
    <small>Occupied</small>
  </li>
</ul>
