const previousAudio = document.querySelector('.js-previous');
const playPauseAudio = document.querySelector('.js-play');
const nextAudio = document.querySelector('.js-next');
const song = document.querySelector('.js-my-song');
const progress = document.querySelector('.progress');
const title = document.querySelector('.song-name');
const artist = document.querySelector('.song-artist');
const repeatAudio = document.querySelector('.repeat');
const shuffleAudio = document.querySelector('.shuffle');
const heartAudio = document.querySelector('.js-heart');
const volumeAudio = document.querySelector('.js-volume');
const currentTiming = document.querySelector('.js-current-time');
const songDuration = document.querySelector('.js-duration');
const playIcon = `<i class="fa-solid fa-play"></i>`;
const pauseIcon = `<i class="fa-solid fa-pause"></i>`;
const lovedIcon = `<i class="fa-solid fa-heart"></i>`;
const loveIcon = `<i class="fa-regular fa-heart"></i>`;
const muteIcon = `<i class="fa-solid fa-volume-xmark"></i> `;
const unmuteIcon = `<i class="fa-solid fa-volume-high"></i> `;

let shuffle = false;
let indexSong = 0;
// Calling out functions
loadSong(indexSong);
songProgress();

// All functions
function songProgress(){
  song.addEventListener('timeupdate', () => {
    progress.value = song.currentTime;
    currentTiming.innerHTML = timeUpdate(song.currentTime)
  })
}

function nextSong() {
  if (shuffle === true) {
    let randomIndex = Math.floor(Math.random() * songList.length);

    while (randomIndex === indexSong) {
      randomIndex = Math.floor(Math.random() * songList.length);
    }

    indexSong = randomIndex
    loadSong(indexSong);
    songPlaying()
  } else {
    if (indexSong === songList.length - 1) {
      indexSong = 0;
      loadSong(indexSong);
      songPlaying()
    } else {
      indexSong ++;
      loadSong(indexSong);
      songPlaying()
    }
  }
}

function previousSong() {
  if (indexSong > 0) {
    indexSong--; 
    loadSong(indexSong);
    songPlaying()
  } else {
    indexSong = songList.length - 1;
    loadSong(indexSong)
    songPlaying()
  }
}

function songPlaying() {
  song.play();
  playPauseAudio.innerHTML = pauseIcon;
  playPauseAudio.classList.add('pulse-control');
  
}

function songPaused () {
  song.pause();
  playPauseAudio.innerHTML = playIcon;
  playPauseAudio.classList.remove('pulse-control')
}

function timeUpdate(time) {
  let min = Math.floor(time / 60)
  if (min < 10) {
    min = `0${min}`
  };

  let sec = Math.floor(time % 60);
  if (sec < 10) {
    sec = `0${sec}`
  };

  return `${min}:${sec}`
}


function loadSong(indexSong) {
  title.innerHTML = songList[indexSong].name;
  artist.innerHTML = songList[indexSong].artist;
  song.src = songList[indexSong].path;

  
  checkLikedSongs();

}


// All addEventListener
playPauseAudio.addEventListener('click', () => {
  if (playPauseAudio.innerHTML === pauseIcon) {
    songPaused()
  } else {
   songPlaying() 
  }
})

previousAudio.addEventListener('click', () => {
 previousSong();
})

nextAudio.addEventListener('click', () => {
  nextSong();
})

let time = 0;
song.addEventListener('loadedmetadata', () =>{
  let time = song.duration;
  progress.max = song.duration;
  progress.value = song.currentTime;
  console.log(time)

  songDuration.innerHTML = timeUpdate(time);

})



song.addEventListener('ended', ()=> {
  nextSong();
})

progress.addEventListener('change', () => {
  song.currentTime = progress.value;
  songPlaying();
})

repeatAudio.addEventListener('click', () => {
  if (song.loop === true) {
    song.loop = false;
    repeatAudio.style.color = '#010a1b'
  } else {    
    song.loop = true;
    repeatAudio.style.color = 'darkred';
  }
})

shuffleAudio.addEventListener('click', () => {

  if (shuffle === true) {
    shuffle = false;
    shuffleAudio.style.color = '#010a1b'
  } else {
  shuffle = true;
  shuffleAudio.style.color = 'darkred' ;
  }
});

volumeAudio.addEventListener ('click', () => {

  if (song.muted === true) {
    volumeAudio.innerHTML = unmuteIcon;
    song.muted = false;
  } else {    
    volumeAudio.innerHTML = muteIcon;
    song.muted = true;
  }
})



// // Function to toggle liked songs in localStorage
heartAudio.addEventListener('click', () => {
  let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
  const currentSong = songList[indexSong].name;

  // Check if the song is already liked
  if (likedSongs.includes(currentSong)) {
    // Remove song from liked list
    likedSongs = likedSongs.filter(song => song !== currentSong);
    heartAudio.innerHTML = loveIcon; // Set to unlike (empty heart)
  } else {
    // Add song to liked list
    likedSongs.push(currentSong);
    heartAudio.innerHTML = lovedIcon; // Set to liked (filled heart)
  }

//   // Save the updated liked songs list to localStorage
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
});

// // Function to check if the current song is liked and update the UI
function checkLikedSongs() {
  let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
  const currentSong = songList[indexSong].name;

  if (likedSongs.includes(currentSong)) {
    heartAudio.innerHTML = lovedIcon; // Show filled heart if liked
  } else {
    heartAudio.innerHTML = loveIcon; // Show empty heart if not liked
  }
}

// // Modify the loadSong function to check liked status each time

// // Ensure liked songs are checked when the page loads
document.addEventListener('DOMContentLoaded', () => {
  checkLikedSongs();
});

