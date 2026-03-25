const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const play = require("play-dl");
const { getQueue, playSong } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("çal")
    .setDescription("Şarkı çalar")
    .addStringOption(o => o.setName("şarkı").setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString("şarkı");
    const vc = interaction.member.voice.channel;
    if (!vc) return interaction.reply("Ses kanalına gir");

    const q = getQueue(interaction.guild.id);

    const result = await play.search(query, { limit: 1 });
    if (!result.length) return interaction.reply("Bulunamadı");

    q.songs.push({ title: result[0].title, url: result[0].url });

    if (!q.connection) {
      q.connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });
      q.connection.subscribe(q.player);
      playSong(interaction.guild.id);
    }

    interaction.reply("🎶 " + result[0].title);
  }
};
