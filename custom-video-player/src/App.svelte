<script>
  let time = 0;
  let duration;
  let paused = true;

  let pressed = false;
  let string;

  const handlePlayPause = () => {
    pressed = !pressed;
    if (pressed) {
      paused = false;
      string = '<i class="fa fa-pause"/>';
    } else {
      paused = true;
      string = '<i class="fa fa-play"/>';
    }
  };

  const handleStop = () => {
    pressed = false;
    string = '<i class="fa fa-play"/>';
    paused = true;
    time = 0;
    cancel();
  };

  const handleMousemove = (e) => {
    if (!(e.buttons & 1)) return;
    if (!duration) return;

    const { left, right } = e.target.getBoundingClientRect();
    time = (duration * (e.clientX - left)) / (right - left);
  };

  const handleSeek = (e) => {
    let pos =
      (e.pageX - (e.target.offsetLeft + e.target.offsetParent.offsetLeft)) /
      e.target.offsetWidth;
    time = pos * duration;
  };

  const handleMousedown = (e) => {
    function handleMouseup() {
      if (paused) {
        pressed = true;
        string = '<i class="fa fa-pause"/>';
        e.target.play();
      } else {
        pressed = false;
        string = '<i class="fa fa-play"/>';
        e.target.pause();
      }
      cancel();
    }

    const cancel = () => {
      e.target.removeEventListener('mouseup', handleMouseup);
    };

    e.target.addEventListener('mouseup', handleMouseup);
    setTimeout(cancel, 200);
  };

  function format(seconds) {
    if (isNaN(seconds)) return '...';

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
  }
</script>

<style>
  h1 {
    color: #fff;
  }

  .screen {
    cursor: pointer;
    width: 60%;
    background-color: #000 !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .controls {
    background: #333;
    color: #fff;
    width: 60%;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  .controls .btn {
    border: 0;
    background: transparent;
    cursor: pointer;
    color: white;
  }

  .controls .btn.btn-stop {
    border: 0;
    background: transparent;
    cursor: pointer;
    color: white;
  }

  .controls .timestamp {
    color: #fff;
    font-weight: bold;
    margin-right: 10px;
  }

  .controls .duration {
    color: #fff;
    font-weight: bold;
    margin-left: 10px;
  }

  progress {
    display: block;
    width: 100%;
    height: 10px;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .controls .btn.btn-stop:hover {
    color: red;
  }

  progress::-webkit-progress-bar {
    background-color: rgba(0, 0, 0, 0.2);
  }

  progress::-webkit-progress-value {
    background-color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 800px) {
    .screen,
    .controls {
      width: 90%;
    }
  }
</style>

<main>
  <h1>Custom Video Player</h1>
  <video
    src="videos/gone.mp4"
    id="video"
    class="screen"
    poster="img/poster.png"
    on:mousemove={handleMousemove}
    on:mousedown={handleMousedown}
    bind:currentTime={time}
    bind:duration
    bind:paused />
  <div class="controls">
    <button class="btn" class:pressed on:click={handlePlayPause}>
      {@html string || '<i class="fa fa-play"/>'}
    </button>

    <button class="btn btn-stop" on:click={handleStop}>
      <i class="fa fa-stop" />
    </button>

    <span class="timestamp" id="timestamp">{format(time)}</span>
    <progress value={time / duration || 0} on:click={handleSeek} />
    <span class="duration" id="duration">{format(duration)}</span>
  </div>
</main>
