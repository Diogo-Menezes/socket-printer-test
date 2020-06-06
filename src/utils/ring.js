var soundPlayer = require('play-sound')();

async function ring() {
  await soundPlayer.play('doorbell-2.mp3', { omxplayer: ['--vol', 9] }, err => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
}

module.exports = ring;
