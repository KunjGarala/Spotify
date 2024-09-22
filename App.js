console.log("HI Kunj");

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
async function getsong(folder) {
  curentfolder = folder;
  const a = await fetch(`https://raw.githubusercontent.com/KunjGarala/Spotify/main/${folder}/`);
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
    <img src="icon/${element
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
    <img src="icon/player_icon3.png" alt="">
    </div>
    </div></li>`;
  }

  attachClickListeners();
}

function attachClickListeners() {
  let previndex;
  const listItems = document.querySelectorAll(".songlist li");

  listItems.forEach((e, index) => {
    e.addEventListener("click", () => {
      const songTitle = e.querySelector(".album-title").innerHTML.trim();
      console.log(songTitle);

      const playicn = e.querySelector(".play-album img");
      if (typeof previndex !== "undefined") {
        const prevItem = document.querySelector(
          `.songlist li:nth-child(${previndex + 1})`
        );
        const prevPlayIcon = prevItem.querySelector(".play-album img");
        prevPlayIcon.src = "icon/player_icon3.png"; // Reset previous play icon
      }

      playicn.src = "icon/PAUSH.svg"; // Change the play icon for the current item
      PlayMusic(songTitle); // Function to play the music

      previndex = index;
    });
  });
}

let PlayMusic = (obj, paush = false, call = true) => {
  // cnt = true;
  // if (cnt) {
  if (call) {
    currentSong.src = `${curentfolder}/` + obj + ".mp3";
  } else {
    currentSong.src = `${curentfolder}/` + obj;
  }
  // }

  console.log(currentSong);
  if (!paush) {
    currentSong.play();
    // currentSong.
    playButton.src = "icon/PAUSH.svg";
  }

  playsong.innerHTML = obj.replaceAll("%20", " ").replaceAll(".mp3", "");
  console.log(obj);
  playsongimg.src = `icon/${obj.replaceAll("%20", " ")}.jpeg`;
  // cnt = true;
};

function secTomin(sec) {
  if (isNaN(sec) || sec < 0) {
    return "invelid";
  }

  const min = Math.floor(sec / 60);
  const playsec = Math.floor(sec % 60);
  const formetmin = String(min).padStart(2, "0");
  const formetsec = String(playsec).padStart(2, "0");
  return `${formetmin}:${formetsec}`;
}

async function displayAlbums() {
  const a = await fetch(`https://raw.githubusercontent.com/KunjGarala/Spotify/main/song/`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let allA = div.getElementsByTagName("a");
  let array = Array.from(allA);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("song/")) {
      let folder = e.href.split("song/")[1];
      const a = await fetch(`https://raw.githubusercontent.com/KunjGarala/Spotify/main/song/${folder}/detail.json`);
      const response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
                          <img src="song/${folder}/cover.jpeg" alt="top50" class="card-img">
                          <img src="icon/playicanback.svg" class="play-button" alt="" style="border-radius: 20px; width: 20px; right: 6%;">
                          <img src="icon/play-button.svg" class="play-button" alt="">
                          <p class="card-title">${response.title}</p>
                          <p class="card-info">${response.description}</p>
                      </div>`;
      console.log(response);
    }
    //lode play list
    Array.from(document.querySelectorAll(".main-content .card")).forEach(
      (e) => {
        e.addEventListener("click", async (item) => {
          let folder = e.getAttribute("data-folder");
          console.log(folder);
          await getsong(`song/${folder}`);
        });
      }
    );
  }
  console.log(div);
}

async function main() {
  await getsong(`song/lol`);
  // console.log(songs[0]);
  PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);

  //display All albums
  displayAlbums();

  playButton.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      console.log("play push");
      playButton.src = "icon/PAUSH.svg";
    } else {
      currentSong.pause();
      playButton.src = "icon/player_icon3.png";
    }
  });

  //time update;

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

  currentSong.addEventListener("timeupdate", rangeChange);

  function rangeChange() {
    const value = rangeInput.value;
    const max = rangeInput.max;
    const progress = (value / max) * 100;
    rangeInput.style.setProperty("--progress", `${progress}%`);
  }

  const rangeInput = document.querySelector(".progress-bar");
  rangeInput.addEventListener("input", rangeChange);

  //volume range update and volume
  const volum = document.querySelector(".progress-bar-control");

  // volum.addEventListener("input", (e) => {
  //   // let value =100;
  //   let value = volum.value;
  //   currentSong.volume = parseInt(e.target.value) / 100;
  //   const max = volum.max;
  //   const progress = (value / max) * 100;
  //   volum.style.setProperty("--progress", `${progress}%`);
  // });

  // Set the initial value of the volume to 100
  volum.value = 100;
  currentSong.volume = 1; // Max volume (100%)

  volum.addEventListener("input", (e) => {
    // Get the current value of the volume slider
    let value = e.target.value;

    // Set the current song's volume based on the slider's value
    currentSong.volume = parseInt(value) / 100;

    // Get the max value of the volume slider
    const max = e.target.max;

    // Calculate the progress in percentage
    const progress = (value / max) * 100;

    // Update the CSS variable for the progress bar to reflect the volume
    volum.style.setProperty("--progress", `${progress}%`);
  });

  function volumeProgtess() {
    const initialProgress = (volum.value / volum.max) * 100;
    volum.style.setProperty("--progress", `${initialProgress}%`);
  }
  volumeProgtess();


  //sidebar update
  let hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", () => {
    document.querySelector(".sidebar").style.left = "0";
  });

  document.querySelector(".sideclose").addEventListener("click", () => {
    document.querySelector(".sidebar").style.left = "-115%";
  });

  let backareo = document.querySelector(".backareo");
  let areo = document.querySelector(".fa-arrow-right");
  areo.addEventListener("click", () => {
    document.querySelector(".sidebar").style.width = "50%";
    areo.style.display = "none";
    backareo.style.display = "inline";
  });
  backareo.addEventListener("click", () => {
    document.querySelector(".sidebar").style.width = "340px";
    backareo.style.display = "none";
    areo.style.display = "inline";
  });

  //previous and next
  let prevsong = document.querySelector("#prev-song");
  let nextsong = document.querySelector("#Next-song");

  prevsong.addEventListener("click", () => {
    currentSong.pause();
    console.log(songs);

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index > 0) {
      PlayMusic(songs[index - 1], false, false);
    }
  });
  nextsong.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index + 1 < songs.length) {
      PlayMusic(songs[index + 1], false, false);
    }
  });

  //click and muite
  volumeicn.addEventListener("click", (e) => {
    console.log();
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      volum.value = 0;
      volumeProgtess();
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      volum.value = 10;
      volumeProgtess();
    }
  });
}

main();
