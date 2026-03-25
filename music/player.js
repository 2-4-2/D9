const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const play = require("play-dl");

const queues = new Map();

function getQueue(id) {
  if (!queues.has(id)) {
    queues.set(id, {
      player: createAudioPlayer(),
      songs: [],
      connection: null
    });
  }
  return queues.get(id);
}

async function playSong(id) {
  const q = queues.get(id);

  if (!q || q.songs.length === 0) {
    q?.connection?.destroy();
    queues.delete(id);
    return;
  }

  const song = q.songs[0];

  try {
    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    q.player.play(resource);

    q.player.once(AudioPlayerStatus.Idle, () => {
      q.songs.shift();
      playSong(id);
    });

  } catch (err) {
    console.log(err);
    q.songs.shift();
    playSong(id);
  }
}

module.exports = { getQueue, playSong };
