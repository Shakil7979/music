//original project
//https://codepen.io/madcat/pen/aNbayb  

var loadedCount = 0;
var speed = 60
var preloader = document.getElementById("preloader")
var percent = document.getElementById("txt-preloadert")
var progress = document.getElementById("progress-preloader")
function plus(loadedCount){
		//loadedCount += 1
		if (loadedCount>100){
			preloader.classList.add("animate__backOutDown");
			setTimeout(function(){preloader.style.display = "none"}, 1000)
		}else{
			percent.innerHTML = loadedCount + "%"
			progress.style.width = loadedCount + "%"		
			
		}
	}	
window.setInterval(
  function(){
    loadedCount += 4; 
    plus(loadedCount)
  },
  speed)


$(document).on('click','#boot_btn',function(){ 
    $('.overlay_btn').show().animate({bottom:'-100%'});
});








$( function() {
    $( ".music_modal" ).draggable();
    $( ".image_model" ).draggable();
    $( ".generator_modal" ).draggable();
    $( ".secend_model_form" ).draggable();
  } );

$(document).on('click','.music_mdl_btn',function(){
    $('.music_modal').show();
});

$(document).on('click','.modal_close',function(){
    $('.music_modal').hide();
});


// $( function() {
//     $( ".generator_modal" ).draggable();
//     $( ".secend_model_form" ).draggable();
//   } );

$(document).on('click','.generator_modal_btn',function(){
    $('.generator_modal').show(); 
});

$(document).on('change','.initial_dist',function(){
  var check = $("input[type='radio'][name='initial_dist']:checked").val();

  if(check == 1){
    $('.secend_model_form').show();
  }else{
    $('.secend_model_form').hide();
  }

  // console.log(check);
})
 
// $(document).on('click','.generate_submit_btn',function(){ 
//     $('.secend_model_form').show();

//     return false;
// });




$(document).on('click','.generator_modal_close',function(){
    $('.generator_modal').hide();
});

$(document).on('click','.secend_model_form_close',function(){
    $('.secend_model_form').hide(); 
});

// $( function() {
//     $( ".image_model" ).draggable();
// } );

$(document).on('click','.image_model_btn',function(){
    $('.image_model').show();
});

$(document).on('click','.image_model_close',function(){
    $('.image_model').hide();
});









  // Music application
let canvas = document.getElementById("myCanvas");
let audio = document.getElementById("myAudio");

audio.crossOrigin = "anonymous";

// Audio source
// Create audio context
// let audioCtx = new AudioContext() || new webkitAudioContext(); -- for safari
let audioCtx = new AudioContext();

// Create audio node so that the analyser can work with
let source = audioCtx.createMediaElementSource(audio);

// Create analyser
let analyser = audioCtx.createAnalyser();

// Make 2d context
let ctx = canvas.getContext("2d");

// Make connections
source.connect(analyser);
source.connect(audioCtx.destination);

// analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.6;
analyser.fftSize = 512;

// Buffer length
let bufferLength = analyser.frequencyBinCount;
let data = new Uint8Array(bufferLength);

// Draw function
//  ** The canvas design ( this draw function), with the exception of some modifications done for the purposes of the app is based on this design: https://github.com/DavidLazic/audio-visualizer/blob/master/visualizer.js
function draw(data) {
  let gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(1, "#ff0033");
  ctx.fillStyle = gradient;
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#ffffff";

  let cx = canvas.width / 2;
  let cy = canvas.height / 2;
  let radius = 140;
  let barWidth = 2;
  let barHeight = 2;
  let barSpacing = 7;
  let maxBarNum = Math.floor((radius * 2 * Math.PI) / (barWidth + barSpacing));
  let slicedPercent = Math.floor((maxBarNum * 25) / 100);
  let barNum = maxBarNum - slicedPercent;
  let freqJump = Math.floor(data.length / maxBarNum);

  for (let i = 0; i < barNum; i++) {
    let amplitude = data[i * freqJump];
    let alfa = (i * 2 * Math.PI) / maxBarNum;
    let beta = ((3 * 45 - barWidth) * Math.PI) / 280;
    let x = 0;
    let y = radius - (amplitude / 12 - barHeight);
    let w = barWidth;
    let h = amplitude / 6 + barHeight;

    ctx.save();
    ctx.translate(cx + barSpacing, cy + barSpacing);
    ctx.rotate(alfa - beta);
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
}

// Loop function
function loopingFunction() {
  requestAnimationFrame(loopingFunction);
  analyser.getByteFrequencyData(data);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(data);
}

loopingFunction();

// Play music
let play = document.querySelector(".play");
let musicIcon = document.querySelector(".icon-play-pause img");

function playMusic() {
  audioCtx.resume();
  canvas.classList.remove("opacity-js");

  if (audio.paused) {
    audio.play();
    musicIcon.src = "https://i.ibb.co/2hWV9L6/pause.png";
  } else {
    audio.pause();
    musicIcon.src = "https://i.ibb.co/MBFjvcj/play.png";
  }
}

play.addEventListener("click", playMusic);

// Stop music
let stop = document.querySelector(".music-stop");
function stopMusic() {
  audio.pause();
  audio.currentTime = 0;
  musicIcon.src = "https://i.ibb.co/MBFjvcj/play.png";
}

stop.addEventListener("click", stopMusic);

// Load track functionality
let songs = document.querySelectorAll(".song-select");
let songArr = [];

songs.forEach(function (song) {
  songArr.push({
    songName: song.dataset.name,
    songAuthor: song.dataset.author,
    songPath: song.dataset.path
  });
});

let musicName = document.querySelector(".music-name");
let counter = 0;
let maxSongs = songArr.length;

function loadMusic(counter) {
  audio.src = `${songArr[counter].songPath}`;
  audio.load();
  musicName.textContent = `${songArr[counter].songAuthor} - ${songArr[counter].songName}`;
}

loadMusic(counter);

// Next and prev song
let next = document.querySelector(".music-next");
let prev = document.querySelector(".music-prev");
next.addEventListener("click", function () {
  if (counter < maxSongs - 1) {
    counter++;
    loadMusic(counter);
  } else {
    counter = 0;
    loadMusic(counter);
  }
  playMusic();
});

prev.addEventListener("click", function () {
  if (counter > 0) {
    counter--;
    loadMusic(counter);
  } else {
    if (counter === 0) counter = maxSongs;
    counter--;
    loadMusic(counter);
  }
  playMusic();
});

// Music ended
audio.addEventListener("ended", function () {
  audio.currentTime = 0;
  musicIcon.src = "/images/play.png";
});

// If you want to add music of your own to test it out, however the functionallity is not fully developed -- it serves for your testing purposes only
let input = document.querySelector("input");
input.addEventListener("change", function (e) {
  var files = this.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  musicName.textContent = input.value;
  playMusic();
});

// Toggle controls
let toggleControl = document.querySelector(".controls");

toggleControl.addEventListener("click", () => {
  if (audio.hasAttribute("controls")) {
    audio.removeAttribute("controls");
  } else {
    audio.setAttribute("controls", "controls");
  }
});

// Toggle video
let vid = document.querySelector(".video-background video");
let toggleVid = document.querySelector(".vid");

toggleVid.addEventListener("click", function () {
  if (vid.paused || vid.ended) {
    vid.play();
    vid.style.opacity = "0.15";
  } else {
    vid.style.opacity = "0";
    vid.pause();
  }
});










// line progress 

