const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
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
  let stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1<<25 });

  if (q.bass) {
    const ffmpegProcess = new prism.FFmpeg({ args:["-analyzeduration","0","-loglevel","0","-i","pipe:0","-af","bass=g=15","-f","s16le","-ar","48000","-ac","2"] });
    stream = stream.pipe(ffmpegProcess);
  }

  const resource = createAudioResource(stream);
  q.player.play(resource);
  q.player.once(AudioPlayerStatus.Idle, () => { q.songs.shift(); playSong(id); });
}

module.exports = { getQueue, playSong };
