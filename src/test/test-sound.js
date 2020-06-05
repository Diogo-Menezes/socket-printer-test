const Omx = require('node-omxplayer');
var soundPlayer = require('play-sound')(opts = {})
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
  soundPlayer.play(
    './doorbell-2.mp3',
    { omxplayer: ['--vol', 9] },
    err => {
      if (err) console.log(`Could not play sound: ${err}`);
    },
  );
}

function play3() {
  playerSound.play('./doorbell-2.mp3', err => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
}

// play();
play2();
// play3();
