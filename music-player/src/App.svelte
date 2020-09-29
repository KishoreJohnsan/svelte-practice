<script>
  import { onMount } from 'svelte';
  import { songs } from './helper';

  let songTitle;
  let audioSrc;
  let coverSrc;
  let songIndex = 0;
  let pressed = false;
  let string;
  let paused = true;
  let play = false;
  let time = 0;
  let duration;

  const handlePlayPause = () => {
    pressed = !pressed;
    play = !play;
    if (pressed) {
      paused = false;
      string = '<i class="fa fa-pause"/>';
    } else {
      paused = true;
      string = '<i class="fa fa-play"/>';
    }
  };

  const loadSong = (song) => {
    songTitle = song;
    audioSrc = `music/${song}.mp3`;
    coverSrc = `images/${song}.jpg`;
  };

  const prevSong = () => {
    songIndex--;
    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
  };

  const nextSong = () => {
    songIndex++;
    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
  };

  const playSong = () => {
    pressed = false;
    play = false;
    paused = true;
    string = '<i class="fa fa-play"/>';

    setTimeout(() => {
      pressed = true;
      play = true;
      paused = false;
      string = '<i class="fa fa-pause"/>';
    }, 10);
  };

  const handleSeek = (e) => {
    let width = e.target.clientWidth;
    let clickX = e.offsetX;

    time = (clickX / width) * duration;
  };

  onMount(() => {
    songIndex = Math.floor(Math.random() * songs.length);
    const song = songs[songIndex];
    loadSong(song);
  });
</script>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Lato', sans-serif;
    margin: 0;
  }

  .music-container {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 20px 20px 0 rgba(252, 169, 169, 0.6);
    display: flex;
    padding: 20px 30px;
    position: relative;
    margin: 100px 0;
    z-index: 10;
  }

  .img-container {
    position: relative;
    width: 110px;
  }

  .img-container::after {
    content: '';
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, 50%);
  }

  .img-container img {
    border-radius: 50%;
    object-fit: cover;
    height: 110px;
    width: inherit;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: rotate 3s linear infinite;

    animation-play-state: paused;
  }

  .music-container.play .img-container img {
    animation-play-state: running;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .action-btn {
    background-color: #fff;
    border: 0;
    color: #dfdbdf;
    font-size: 20px;
    cursor: pointer;
    padding: 10px;
    margin: 0 20px;
  }

  .action-btn.action-btn-big {
    color: #cdc2d0;
    font-size: 30px;
  }

  .action-btn:focus {
    outline: 0;
  }

  .music-info {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px 15px 0 0;
    position: absolute;
    top: 0;
    left: 20px;
    width: calc(100% - 40px);
    padding: 10px 10px 10px 150px;
    opacity: 0;
    transform: translateY(0%);
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;
    z-index: 0;
  }

  .music-container.play .music-info {
    opacity: 1;
    transform: translateY(-100%);
  }

  .music-info h4 {
    margin: 0;
  }

  progress {
    background-color: #ffffff;
    border: none;
    display: block;
    width: 100%;
    height: 5px;
    appearance: none;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  progress::-webkit-progress-bar {
    background-color: #fff;
    width: 100%;
  }

  progress::-webkit-progress-value {
    background-color: #fe8daa;
  }

  progress::-moz-progress-bar {
    background-color: #fe8daa;
  }
</style>

<main>
  <h1>Music Player</h1>

  <div class="music-container" class:play id="music-container">
    <div class="music-info">
      <h4 id="title">{songTitle}</h4>
      <progress value={time / duration || 0} on:click={handleSeek} />
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->
    <audio src={audioSrc} id="audio" bind:currentTime={time} bind:duration bind:paused ></audio>

    <div class="img-container">
      <img src={coverSrc} alt="music-cover" id="cover" />
    </div>
    <div class="navigation">
      <button id="prev" class="action-btn" on:click={prevSong}>
        <i class="fas fa-backward" />
      </button>
      <button
        id="play"
        class="action-btn action-btn-big"
        on:click={handlePlayPause}>
        {@html string || '<i class="fas fa-play"/>'}
      </button>
      <button id="next" class="action-btn" on:click={nextSong}>
        <i class="fas fa-forward" />
      </button>
    </div>
  </div>
</main>
