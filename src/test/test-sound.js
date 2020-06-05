const Omx = require('node-omxplayer');

const player = Omx('doorbell-2.mp3', 'local', false, 9);

async function play() {
  try {
    player.volUp(9);
    await player.play();
    await player.quit();
    console.log('done');
  } catch (error) {
    console.error(error);
  }
}

play();
