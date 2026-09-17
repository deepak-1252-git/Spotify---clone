const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
}); 

let songs;

let currentSong = new Audio()

async function getSongs(folder) {
    // fatch songs from folder
    // currentFolder = folder;
    const a = await fetch(`http://127.0.0.1:3002/${folder}/`);
    const responce = await a.text();
    // console.log(responce)
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")

    // stored in songs list
    let songs = []
    let svgs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
        else if (element.href.endsWith(".svg")) {
            svgs.push(element.href)
        }
    }
    // console.log(songs)
    console.log(svgs)

    return songs;
};

// function time formation 
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// function for convert time+duration into percntage
const circleOnseekbar = (cst, csd) => {
    let percentage = ((cst / csd) * 100 + "%")
    // console.log(percentage)
    return percentage;
};

// function to play
const playmusic = (track, pause = false) => {
    currentSong.src = "%5Caudios%5C" + track + ".mp3";
    currentSong.currentTime = 0;
    if (!pause) {
        currentSong.play();
        play.src = "/svg/pauseicon.svg"
    }

    document.getElementById("currentsongname").innerHTML = track


    // let playsong = new Audio("/audios/" + track)
    // playsong.play();
    // console.log(currentSong.src);
};

async function main() {
    let songs = await getSongs("audios")
    // console.log(songs)
    // let svgs = await getSongs("svg") 
    // permanent song
    playmusic(songs[0].replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1], true)

    // show songs in spotify play list 
    let songul = document.querySelector(".spotifyplaylist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML +
            `<li class="flex items-center gap b-redious space-btw">
                <div class="song-card flex ">
                    <img src="/svg/musicicon.svg" alt="music">
                    <p type="text" class="song-name">${song.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1]}</p>
                </div>
                <div class="play-triangle ">
                    <img class="invert" src="/svg/playicon.svg" alt="playicon">
                </div>
            </li>`;
    }

    // click function on each li of songs
    Array.from(document.querySelector(".spotifyplaylist").getElementsByTagName("li")).forEach(element => {
        // console.log(element)
        element.addEventListener("click", e => {
            // console.log(element.querySelector(".song-card").children[1].innerHTML)

            playmusic(element.querySelector(".song-card").children[1].innerHTML)

        })
    });


    // click for play or pause 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/svg/pauseicon.svg"
        }
        else {
            currentSong.pause()
            play.src = "/svg/playicon.svg"
        }
    });

    // click for previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src);
        if (index - 1 >= 0) {
            let previousSong = songs[index - 1]
            playmusic(previousSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])
        }
        else {
            let nextSong = songs[songs.length - 1]
            playmusic(nextSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])

        }
    });

    // click for next
    next.addEventListener("click", () => {
        // currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src);
        if (index + 1 < songs.length) {
            let nextSong = songs[index + 1]
            playmusic(nextSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])
        }
        else {
            let nextSong = songs[0]
            playmusic(nextSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])

        }
    });

    // update song time
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)

        document.getElementById("currentsongtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".red-line").style.width = circleOnseekbar(currentSong.currentTime, currentSong.duration)
    });

    currentSong.addEventListener("ended", () => {
        if (currentSong.currentTime >= currentSong.duration) {
            let index = songs.indexOf(currentSong.src);
            if (index + 1 < songs.length) {
                let nextSong = songs[index + 1];
                playmusic(nextSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])

            } else {
                let nextSong = songs[0];
                playmusic(nextSong.replaceAll("%20", " ").replace(".mp3", "").split("%5Caudios%5C")[1])
            }
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let seekbar = e.currentTarget;
        let rect = seekbar.getBoundingClientRect();

        let clickX = e.clientX - rect.left;

        let percntageNew = circleOnseekbar(clickX, rect.width)

        document.querySelector(".red-line").style.width = percntageNew;

        currentSong.currentTime = ((currentSong.duration) * percntageNew.replace("%", "")) / 100;
    });

    volumeSeekbar.addEventListener("change", (e) => {
        // console.log(e , e.currentTarget ,e.currentTarget.value)

        currentSong.volume = parseInt(e.currentTarget.value) / 100

        if (currentSong.volume >= .9) {
            volumeBtn.src = "/svg/vol100.svg"
        }
        else if (currentSong.volume >= .6) {
            volumeBtn.src = "/svg/vol80.svg"
        }
        else if (currentSong.volume >= .3) {
            volumeBtn.src = "/svg/vol60.svg"
        }
        else if (currentSong.volume > 0.04) {
            volumeBtn.src = "/svg/vol20.svg"
        }
        else if (currentSong.volume >= 0.0) {
            volumeBtn.src = "/svg/vol0.svg"
        }

    })

};

main();