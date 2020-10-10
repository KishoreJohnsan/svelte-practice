<script>
  import { prevent_default } from 'svelte/internal';

  let searchTerm = '';
  let songList = [];
  let nextSongList = '';
  let prevSongList = '';
  let lyrics = '';
  let artistName = '';
  let songName = '';
  let heading = 'Results will be displayed here';

  const apiURL = 'https://api.lyrics.ovh';

  const searchLyrics = async () => {
    if (searchTerm !== '') {
      const res = await fetch(`${apiURL}/suggest/${searchTerm}`);
      let data = await res.json();
      setData(data);
    } else {
      alert('Please enter an artist or song name');
    }
  };

  const getMoreSongs = async (url) => {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    let data = await res.json();
    setData(data);
  };

  const setData = (data) => {
    heading = '';
    songList = data.data;
    if (data.next) nextSongList = data.next;
    if (data.prev) prevSongList = data.prev;
  };

  const getLyrics = async (artist, songTitle) => {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    let data = await res.json();
    artistName = artist;
    songName = songTitle;
    heading = '';

    if (data.error) {
      songList = data.error;
    } else {
      let content = data.lyrics;
      lyrics = content.replace(/(\r\n|\r|\n)/g, '<br>');
      songList = '';
      nextSongList = '';
      prevSongList = '';
    }
  };
</script>

<style>
  button {
    cursor: pointer;
  }

  button:active {
    transform: scale(0.95);
  }

  input:focus,
  button:focus {
    outline: none;
  }

  header {
    background-image: url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
    position: relative;
  }

  header::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  header * {
    z-index: 1;
  }

  header h1 {
    margin: 0 0 30px;
  }

  .form {
    position: relative;
    width: 500px;
    max-width: 100%;
  }

  .form input {
    border: 0;
    border-radius: 50px;
    font-size: 16px;
    padding: 15px 30px;
    width: 100%;
  }

  .form button {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: #e056fd;
    border: 0;
    border-radius: 50px;
    color: #fff;
    font-size: 16px;
    padding: 13px 30px;
  }

  .btn {
    background-color: #8d56fd;
    border: 0;
    border-radius: 10px;
    color: #fff;
    padding: 4px 10px;
  }

  ul.songs {
    list-style-type: none;
    padding: 0;
  }

  ul.songs li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
  }

  .container {
    margin: 30px auto;
    max-width: 100%;
    width: 500px;
  }

  .container h2 {
    font-weight: 300;
  }

  .container p {
    text-align: center;
  }

  .centered {
    display: flex;
    justify-content: center;
  }

  .centered button {
    transform: scale(1.3);
    margin: 15px;
  }
</style>

<main>
  <header>
    <h1>Lyrics Search</h1>

    <div class="form">
      <input
        type="text"
        id="search"
        placeholder="Enter artist or song name..."
        bind:value={searchTerm} />
      <button on:click={searchLyrics || prevent_default}>Search</button>
    </div>
  </header>

  <div id="result" class="container">
    {#if heading}
      <p>{heading}</p>
    {/if}
    <ul class="songs">
      {#each songList as song}
        <li>
          <span><strong>{song.artist.name}</strong> - {song.title}</span>
          <button
            class="btn"
            on:click={getLyrics(song.artist.name, song.title)}>Get Lyrics</button>
        </li>
      {/each}
    </ul>

    {#if lyrics}
      <h2><strong>{artistName}</strong> - {songName}</h2>
      <span>{@html lyrics}</span>
    {/if}
  </div>

  <div id="more" class="container centered">
    {#if prevSongList}
      <button class="btn" on:click={getMoreSongs(prevSongList)}>Prev</button>
    {/if}
    {#if nextSongList}
      <button class="btn" on:click={getMoreSongs(nextSongList)}>Next</button>
    {/if}
  </div>
</main>
