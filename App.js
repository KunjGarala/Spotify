console.log("HI Kunj");

let currentSong = new Audio();
let playButton = document.querySelector("#play-song");
let playsong = document.querySelector(".music-player .album-title");
let libplaybtn = document.querySelector(".play-album img");
let toteltime = document.querySelector(".totel-time");
let curenttime = document.querySelector(".curent-time");


async function getsong() {
  // const a = await fetch("http://127.0.0.1:5500/song/");
  // const response = await a.text();

  const a = await fetch("https://api.github.com/repos/KunjGarala/Spotify/contents/song");
  const response = await a.json();

  // const div = document.createElement("div");
  // div.innerHTML = response;
  // let as = div.getElementsByTagName("a");
  let song = [];
  // for (let index = 0; index < as.length; index++) {
  //   const element = as[index];
  //   if (element.href.endsWith(".mp3")) {
  //     song.push(element.href.split("song/")[1]);
  //   }
  // }

  response.forEach(file => {
    if (file.name.endsWith(".mp3")) {
        song.push(file.download_url.split("song/")[1]); // GitHub provides the download URL directly
    }
});
  return song;
}

let PlayMusic = (obj, paush = false) => {
  currentSong.src = "/song/" + obj + ".mp3";
  if (!paush) {
    currentSong.play();
    playButton.src = "icon/PAUSH.svg";
  }
  playsong.innerHTML = obj;
  // libplaybtn.classList.add("kunj");
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

async function main() {
  let songs = await getsong();
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  PlayMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""), true);
  for (const element of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><div class="album stylesong">
                                <div class="set-album">
                                    <div class="album-img">
                                        <img src="icon/Bajrang-Baan-Lofi-Hindi.jpg">
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

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".album-title").innerHTML);
      PlayMusic(e.querySelector(".album-title").innerHTML.trim());
    });
  });

  //for next play Prev

  // let currentSong = document.querySelector("audio"); // assuming you have an <audio> element

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
    //temp
  });
  const rangeInput = document.querySelector(".progress-bar");
  rangeInput.addEventListener("input", () => {
    const value = rangeInput.value;
    const max = rangeInput.max;
    const progress = (value / max) * 100;
    rangeInput.style.setProperty("--progress", `${progress}%`);
  });
  const volum = document.querySelector(".progress-bar-control");
  volum.addEventListener("input", () => {
    let value = volum.value;
    const max = volum.max;
    const progress = (value / max) * 100;
    volum.style.setProperty("--progress", `${progress}%`);
  });
  let hamburger = document.querySelector(".hamburger");

  hamburger.addEventListener("click",()=>{
    document.querySelector(".sidebar").style.left = "0";
    
  })

  document.querySelector(".sideclose").addEventListener("click",()=>{
    document.querySelector(".sidebar").style.left = "-115%";

  })


let backareo = document.querySelector(".backareo");
  let areo =document.querySelector(".fa-arrow-right");
  areo.addEventListener("click",()=>{
    document.querySelector(".sidebar").style.width = "50%";
    areo.style.display = "none";
    backareo.style.display = "inline"
  })
  backareo.addEventListener("click",()=>{
    document.querySelector(".sidebar").style.width = "340px";
    backareo.style.display = "none";
    areo.style.display = "inline";
  })

}

main();
