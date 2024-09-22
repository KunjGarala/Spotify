let currentSong = new Audio();
let playButton = document.querySelector("#play-song");
let playsong = document.querySelector(".music-player .album-title");
let playsongimg = document.querySelector(".music-player .album-img img");
let libplaybtn = document.querySelector(".play-album img");
let toteltime = document.querySelector(".totel-time");
let curenttime = document.querySelector(".curent-time");
let cardContainer = document.querySelector(".cards-container-res");
let volumeicn = document.querySelector(".volumeicn");

let curentfolder;
let cnt = false;

let songs = [];

/**
 * Fetch songs from the Spotify API.
 * @param {string} folder - The folder name to fetch songs from.
 */
async function getsong(folder) {
  curentfolder = folder;
  const a = await fetch(`https://kunjgarala.github.io/Spotify/${folder}/`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  console.log("song" + songs);
  songs = song;

  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const element of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><div class="album stylesong">
    <div class="set-album">
    <div class="album-img">
    <img src="https://kunjgarala.github.io/Spotify/icon/${element
      .replaceAll("%20", " ")
      .replaceAll(".mp3", ".jpeg")}">
    </div>
    <div class="album-text" style="">
    <p class="album-title">${element
      .replaceAll("%20", " ")
      .replaceAll(".mp3", "")}</p>
    <p class="album-info">Rasraj Ji Maharaj</p>
    </div>
    </div>
    <div class="play-album">
    <img src="https://kunjgarala.github.io/Spotify/icon/player_icon3.png" alt="Play">
    </div>
    </div></li>`;
  }

  attachClickListeners();
}


/**
 * Attach click listeners to the song items for playing.
 */
function attachClickListeners() {
  let previndex;
  const listItems = document.querySelectorAll(".songlist li");

  listItems.forEach((e, index) => {
    e.addEventListener("click", () => {
      const songTitle = e.querySelector(".album-title").innerHTML.trim();
      const playicn = e.querySelector(".play-album img");

      if (typeof previndex !== "undefined") {
        const prevItem = document.querySelector(
          `.songlist li:nth-child(${previndex + 1})`
        );
        const prevPlayIcon = prevItem.querySelector(".play-album img");
        prevPlayIcon.src = `${data.baseUrl}/icon/player_icon3.png`; // Reset previous play icon
      }

      playicn.src = `${data.baseUrl}/icon/PAUSH.svg`; // Change the play icon for the current item
      PlayMusic(songTitle); // Function to play the music

      previndex = index;
    });
  });
}

/**
 * Play music by song title.
 * @param {string} obj - The song title.
 * @param {boolean} paush - Whether to pause.
 * @param {boolean} call - Whether it's a new song call.
 */
let PlayMusic = (obj, paush = false, call = true) => {
  if (call) {
    currentSong.src = `https://api.github.com/KunjGarala/Spotify/${curentfolder}/` + obj + ".mp3"; // Spotify API call to get mp3
  } else {
    currentSong.src = `https://api.github.com/KunjGarala/Spotify/${curentfolder}/` + obj;
  }

  if (!paush) {
    currentSong.play();
    playButton.src = `${data.baseUrl}/icon/PAUSH.svg`;
  }

  playsong.innerHTML = obj.replaceAll(".mp3", "");
  playsongimg.src = `${data.baseUrl}/images/${obj.replaceAll(".mp3", ".jpeg")}`;
};

function secTomin(sec) {
  if (isNaN(sec) || sec < 0) {
    return "Invalid";
  }

  const min = Math.floor(sec / 60);
  const playsec = Math.floor(sec % 60);
  const formatMin = String(min).padStart(2, "0");
  const formatSec = String(playsec).padStart(2, "0");
  return `${formatMin}:${formatSec}`;
}

async function displayAlbums() {
  const response = await fetch(`https://api.github.com/KunjGarala/Spotify/albums`); // Fetch albums from Spotify API
  const data = await response.json(); // Assuming API returns a JSON with album info
  const albums = data.albums; // Array of albums from the API

  for (const album of albums) {
    const { folder, title, description } = album;
    cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <img src="${data.baseUrl}/song/${folder}/cover.jpeg" alt="${title}" class="card-img">
        <img src="${data.baseUrl}/icon/playicanback.svg" class="play-button" alt="">
        <img src="${data.baseUrl}/icon/play-button.svg" class="play-button" alt="">
        <p class="card-title">${title}</p>
        <p class="card-info">${description}</p>
      </div>`;
  }

  // Load playlist on clicking a card
  Array.from(document.querySelectorAll(".main-content .card")).forEach((e) => {
    e.addEventListener("click", async () => {
      let folder = e.getAttribute("data-folder");
      await getsong(`song/${folder}`);
    });
  });
}

async function main() {
  await getsong(`song/lol`);
  PlayMusic(songs[0].replaceAll(".mp3", ""), true);

  // Display all albums
  displayAlbums();

  playButton.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playButton.src = `${data.baseUrl}/icon/PAUSH.svg`;
    } else {
      currentSong.pause();
      playButton.src = `${data.baseUrl}/icon/player_icon3.png`;
    }
  });

  const x = document.querySelector("#seekbar");
  currentSong.addEventListener("timeupdate", () => {
    toteltime.innerHTML = secTomin(currentSong.duration);
    curenttime.innerHTML = secTomin(currentSong.currentTime);
    x.value = (currentSong.currentTime / currentSong.duration) * 10000;
  });

  x.addEventListener("click", (e) => {
    const temp = e.target.value / 100;
    currentSong.currentTime = (currentSong.duration * temp) / 100;
  });
  
  // Continue with volume controls, mute logic, etc.
}

main();
