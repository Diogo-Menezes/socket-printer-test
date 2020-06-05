const Omx = require('node-omxplayer');

const player = Omx('doorbell-2.mp3');

async function play() {
  try {
    await player.play();
    console.log('done');
  } catch (error) {
    console.error(error);
  }
}

play();
