// console.log("HI Kunj");

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
let curentfolder;
let cnt = false;

let songs = [];
async function getsong(folder) {
  curentfolder = folder;
  playButton.src = "icon/player_icon3.png";

  // Fetch repository contents from the GitHub API
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
    <p class="album-info">Rasraj Ji Maharaj</p>
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

function managePlayIcons(index, e) {
  const playicn = e.querySelector(".play-album img");

  if (typeof previndex !== "undefined") {
    const prevItem = document.querySelector(
      `.songlist li:nth-child(${previndex + 1})`
    );
    const prevPlayIcon = prevItem.querySelector(".play-album img");
    prevPlayIcon.src = "icon/player_icon3.png"; // Reset previous play icon
  }
  playicn.src = "icon/spoti.svg"; // Change the play icon for the current item

  previndex = index;
  
}

// Usage example:
function attachClickListeners() {
  const listItems = document.querySelectorAll(".songlist li");

  listItems.forEach((e, index) => {
    e.addEventListener("click", () => {
      const songTitle = e.querySelector(".album-title").innerHTML.trim();
      // Call your PlayMusic function here with the songTitle
      // ...

      managePlayIcons(index, e); // Call our custom function
      PlayMusic(songTitle);
    });
  });
}

// function attachClickListeners() {
//   const listItems = document.querySelectorAll(".songlist li");
  
//   listItems.forEach((e, index) => {
//     e.addEventListener("click", () => {
//       const songTitle = e.querySelector(".album-title").innerHTML.trim();
//       // console.log(songTitle);
      

//       const playicn = e.querySelector(".play-album img");
//       if (typeof previndex !== "undefined") {
//         const prevItem = document.querySelector(
//           `.songlist li:nth-child(${previndex + 1})`
//         );
//         const prevPlayIcon = prevItem.querySelector(".play-album img");
//         prevPlayIcon.src = "icon/player_icon3.png"; // Reset previous play icon
//       }
//       playicn.src = "icon/spoti.svg"; // Change the play icon for the current item
//       previndex = index;
//       PlayMusic(songTitle); // Function to play the music

//     });
//   });
// }

let PlayMusic = (obj, paush = false, call = true) => {
  if (call) {
    currentSong.src = `${curentfolder}/` + obj + ".mp3";
  } else {
    currentSong.src = `${curentfolder}/` + obj;
  }

  if (!paush) {
    currentSong.play();
    // currentSong.
    playButton.src = "icon/PAUSH.svg";
  }
  playsongimg.src = `icon/${obj
    .replaceAll("%20", " ")
    .replaceAll(".mp3", "")}.jpeg`;
  playsong.innerHTML = obj.replaceAll("%20", " ").replaceAll(".mp3", "");
  // console.log(obj);
  // cnt = true;
};

function musiciconchange(index){
  let temp = document.querySelectorAll(".songlist li");
  let templi =  Array.from(temp);
  for (let indext = 0; indext < templi.length; indext++) {
  const element = templi[indext];
  if (indext ===index ) {
    managePlayIcons(index, element)
  }
}
}

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

async function displayAlbums() {
  // Fetch the contents of the 'song' folder from GitHub API
  const apiURL = `https://api.github.com/repos/KunjGarala/Spotify/contents/song`;
  const a = await fetch(apiURL);
  const response = await a.json();
  
  let allA = Array.from(response); // List of files and folders in the 'song' directory
  for (let index = 0; index < allA.length; index++) {
    const e = allA[index];
    if (e.type === "dir") { // Check if it is a folder
      let folder = e.name;

      // Fetch the 'detail.json' file inside each folder
      const detailURL = `https://api.github.com/repos/KunjGarala/Spotify/contents/song/${folder}/detail.json`;
      const detailResponse = await fetch(detailURL);
      const detailJSON = await detailResponse.json();

      // The content of the detail.json is base64-encoded, so we decode it
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
          cardContainerres.append(x);
        }

        await getsong(`song/${folder}`);
        PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);
      });
    });
  }
}

async function main() {
  await getsong(`song/lol`);
  PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);

  const x = document.querySelector("#seekbar");
  //display All albums
  displayAlbums();
  playButton.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      // console.log("play push");
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
      // currentSong.pause();
      // playButton.src = "icon/player_icon3.png";
      toteltime.innerHTML = ``;
      curenttime.innerHTML = ``;
      x.value = 0;
    } else {
      toteltime.innerHTML = secTomin(currentSong.duration);
      curenttime.innerHTML = secTomin(currentSong.currentTime);
      x.value = (currentSong.currentTime / currentSong.duration) * 10000;
    }
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

// Handle previous song
prevsong.addEventListener("click", () => {
  currentSong.pause();

  // Get the current song filename from the source
  let currentSongName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
  let index = songs.indexOf(currentSongName);

  // Move to the previous song if available
  if (index > 0) {
    musiciconchange(index - 1);  // Update icon
    PlayMusic(songs[index - 1], false, false);  // Play previous song
  } else {
    console.log("No previous song.");
  }
});

// Handle next song
nextsong.addEventListener("click", () => {
  currentSong.pause();

  // Get the current song filename from the source
  let currentSongName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
  let index = songs.indexOf(currentSongName);

  // Move to the next song if available
  if (index + 1 < songs.length) {
    musiciconchange(index + 1);  // Update icon
    PlayMusic(songs[index + 1], false, false);  // Play next song
  } else {
    console.log("No next song.");
  }
});



  //click and muite
  volumeicn.addEventListener("click", (e) => {
    // console.log();
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
