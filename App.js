let currentSong = new Audio();
let playButton = document.querySelector("#play-song");
let playsong = document.querySelector(".music-player .album-title");
let playsongimg = document.querySelector(".music-player .album-img img");
let libplaybtn = document.querySelector(".play-album img");
let toteltime = document.querySelector(".totel-time");
let curenttime = document.querySelector(".curent-time");
let cardContainer = document.querySelector(".cards-container-Tranding");
let cardContainerres = document.querySelector(".cards-container-res");
let volumeicn = document.querySelector(".volumeicn");
let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
let x = document.querySelector("#seekbar");
let curentfolder;
let cnt = false;


let loading = document.querySelector(".load");


let songs = [];
async function getsong(folder) {
  curentfolder = folder;
  playButton.src = "icon/player_icon3.png";
  const apiURL = `https://api.github.com/repos/KunjGarala/Spotify/contents/${folder}`;
  const a = await fetch(apiURL);
  const response = await a.json();
  let song = [];
  for (let index = 0; index < response.length; index++) {
    const element = response[index];
    if (element.name.endsWith(".mp3")) {
      song.push(element.name);
    }
  }
  songs = song;

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
    <p class="album-info">Kunj Garala</p>
    </div>
    </div>
    <div class="play-album">
    <img src="icon/player_icon3.png" alt="">
    </div>
    </div></li>`;
  }

  attachClickListeners();
  managePlayIcons(0, songUl.firstChild);
}
let previndex;



// Change the play icon for the current item in album
function managePlayIcons(index, e) {
  const playicn = e.querySelector(".play-album img");

  if (typeof previndex !== "undefined") {
    const prevItem = document.querySelector(
      `.songlist li:nth-child(${previndex + 1})`
    );
    const prevPlayIcon = prevItem.querySelector(".play-album img");
    prevPlayIcon.src = "icon/player_icon3.png";
  }
  playicn.src = "icon/spoti.svg";

  previndex = index;
}

// click albu and play music 
function attachClickListeners() {
  const listItems = document.querySelectorAll(".songlist li");

  listItems.forEach((e, index) => {
    e.addEventListener("click", () => {
      const songTitle = e.querySelector(".album-title").innerHTML.trim();
      managePlayIcons(index, e);
      PlayMusic(songTitle);
    });
  });
}


// play music
let PlayMusic = (obj, paush = false, call = true) => {
  if (call) {
    currentSong.src = `${curentfolder}/` + obj + ".mp3";
  } else {
    currentSong.src = `${curentfolder}/` + obj;
  }

  if (!paush) {
    currentSong.play();
    playButton.src = "icon/PAUSH.svg";
  }
  playsongimg.src = `icon/${obj
    .replaceAll("%20", " ")
    .replaceAll(".mp3", "")}.jpeg`;
  playsong.innerHTML = obj.replaceAll("%20", " ").replaceAll(".mp3", "");
};


// in next play music icon change to next song
function musiciconchange(index) {
  let temp = document.querySelectorAll(".songlist li");
  let templi = Array.from(temp);
  for (let indext = 0; indext < templi.length; indext++) {
    const element = templi[indext];
    if (indext === index) {
      managePlayIcons(index, element);
    }
  }
}


// second to minuts convert
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
let resentload = true;


// display all album
async function displayAlbums() {
  const apiURL = `https://api.github.com/repos/KunjGarala/Spotify/contents/song`;
  const a = await fetch(apiURL);
  const response = await a.json();

  let allA = Array.from(response);
  for (let index = 0; index < allA.length; index++) {
    const e = allA[index];
    if (e.type === "dir") {
      let folder = e.name;
     const detailURL = `https://api.github.com/repos/KunjGarala/Spotify/contents/song/${folder}/detail.json`;
      const detailResponse = await fetch(detailURL);
      const detailJSON = await detailResponse.json();
      const jsonString = atob(detailJSON.content);
      const parsedDetail = JSON.parse(jsonString);

      // Add the card with album details
      cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <img src="https://raw.githubusercontent.com/KunjGarala/Spotify/main/song/${folder}/cover.jpeg" alt="cover" class="card-img">
          <img src="icon/playicanback.svg" class="play-button" alt="" style="border-radius: 20px; width: 20px; right: 6%;">
          <img src="icon/play-button.svg" class="play-button" alt="">
          <p class="card-title">${parsedDetail.title}</p>
          <p class="card-info">${parsedDetail.description}</p>
        </div>
      `;

      if (resentload) {
        cardContainerres.innerHTML += `
          <div data-folder="${folder}" class="card">
            <img src="https://raw.githubusercontent.com/KunjGarala/Spotify/main/song/${folder}/cover.jpeg" alt="cover" class="card-img">
            <img src="icon/playicanback.svg" class="play-button" alt="" style="border-radius: 20px; width: 20px; right: 6%;">
            <img src="icon/play-button.svg" class="play-button" alt="">
            <p class="card-title">${parsedDetail.title}</p>
            <p class="card-info">${parsedDetail.description}</p>
          </div>
        `;
        resentload = false;
      }
    }

    // Load playlist on card click
    let card = document.querySelectorAll(".card");
    cardContainerres.addEventListener("click", async (event) => {
      const clickedCard = event.target.closest(".card");
      if (clickedCard) {
        const folder = clickedCard.getAttribute("data-folder");
        await getsong(`song/${folder}`);
        PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);
      }
    });


    // resent played music
    Array.from(card).forEach((e) => {
      e.addEventListener("click", async (item) => {
        let folder = e.getAttribute("data-folder");
        let x = e.cloneNode(true);

        let children = cardContainerres.children;
        let exist = true;
        Array.from(children).forEach((element) => {
          if (element.getAttribute("data-folder") === folder) {
            exist = false;
          }
        });

        if (exist) {
          cardContainerres.insertBefore(x, cardContainerres.firstChild);
        }

        await getsong(`song/${folder}`);
        PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);
      });
    });
  }
}



async function main() { 

  window.addEventListener("load", async () => {
    await getsong(`song/lol`);
    PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);
    displayAlbums();
    loading.style.display = "none";
  });

  //play and paush
  playButton.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playButton.src = "icon/PAUSH.svg";
    } else {
      currentSong.pause();
      playButton.src = "icon/player_icon3.png";
    }
  });


  //time update;
  currentSong.addEventListener("timeupdate", () => {
    const parsedDuration = parseInt(currentSong.duration);
    if (Number.isNaN(parsedDuration)) {
      toteltime.innerHTML = ``;
      curenttime.innerHTML = ``;
      x.value = 0;
    } else {
      toteltime.innerHTML = secTomin(currentSong.duration);
      curenttime.innerHTML = secTomin(currentSong.currentTime);
      x.value = (currentSong.currentTime / currentSong.duration) * 10000;
    }
  });

  x.addEventListener("input", (e) => {
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
  volum.value = 100;
  currentSong.volume = 1; 
  volum.addEventListener("input", (e) => {
    let value = e.target.value;
    currentSong.volume = parseInt(value) / 100;
    const max = e.target.max;
    const progress = (value / max) * 100;
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


  prevsong.addEventListener("click", () => {             //previous
    currentSong.pause();
    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").slice(-1)[0]
    );
    let index = songs.indexOf(currentSongName);
    if (index > 0) {
      musiciconchange(index - 1);
      PlayMusic(songs[index - 1], false, false); 
    }
  });

  
  nextsong.addEventListener("click", () => {                   //next
    currentSong.pause();
    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").slice(-1)[0]
    );
    let index = songs.indexOf(currentSongName);
    if (index + 1 < songs.length) {
      musiciconchange(index + 1);
      PlayMusic(songs[index + 1], false, false); // Play next song
    }
  });

  //click and muite
  volumeicn.addEventListener("click", (e) => {
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
