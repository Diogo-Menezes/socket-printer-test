const Omx = require('node-omxplayer');

const player = Omx('./doorbell-2.mp3');

async function play() {
  try {
    player.volUp(9);
    await player.play();
    setTimeout(() => {
      player.quit();
      console.log('done');
    }, 3000);

    player.on('close', console.log('finished'));
  } catch (error) {
    console.error(error);
  }
}

play();
