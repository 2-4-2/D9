const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const play = require("play-dl");
const prism = require("prism-media");

const queues = new Map();

function getQueue(id) {
  if (!queues.has(id)) queues.set(id, { player: createAudioPlayer(), songs: [], connection: null, bass: false });
  return queues.get(id);
}

async function playSong(id) {
  const q = queues.get(id);
  if (!q || !q.songs.length) { q?.connection?.destroy(); queues.delete(id); return; }

  const song = q.songs[0];
  const stream = await play.stream(song.url);
  let audioStream = stream.stream;

  if (q.bass) {
    const ffmpegProcess = new prism.FFmpeg({ args:["-analyzeduration","0","-loglevel","0","-i","pipe:0","-af","bass=g=15","-f","s16le","-ar","48000","-ac","2"] });
    audioStream = audioStream.pipe(ffmpegProcess);
  }

  const resource = createAudioResource(audioStream, { inputType: stream.type });
  q.player.play(resource);
  q.player.once(AudioPlayerStatus.Idle, () => { q.songs.shift(); playSong(id); });
}

module.exports = { getQueue, playSong };
