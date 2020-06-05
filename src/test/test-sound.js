const Omx = require('node-omxplayer');
const soundPlayer = require('play-sound');
const playerSound = require('sound-play');
const player = Omx('./doorbell-2.mp3');

async function play() {
  try {
    player.volUp(9);
    await player.play();

    player.on('close', () => console.log('finished'));
  } catch (error) {
    console.error(error);
  }
}
function play2() {
  soundPlayer.play('./media/roadrunner.mp3', err => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
}

function play3() {
  playerSound.play('./media/roadrunner.mp3', err => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
}

// play();
play2();
// play3();
