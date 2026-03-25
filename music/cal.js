const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getQueue, playSong } = require("../music/player");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("çal")
    .setDescription("Şarkı çalar")
    .addStringOption(o => o.setName("şarkı").setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString("şarkı");
    const vc = interaction.member.voice.channel;
    if (!vc) return interaction.reply("❌ Ses kanalına gir");

    const q = getQueue(interaction.guild.id);
    const url = (ytdl.validateURL(query)) ? query : (await ytdl.getInfo(query)).videoDetails.video_url;

    q.songs.push({ title: query, url });

    if (!q.connection) {
      q.connection = joinVoiceChannel({ channelId: vc.id, guildId: interaction.guild.id, adapterCreator: interaction.guild.voiceAdapterCreator });
      q.connection.subscribe(q.player);
      playSong(interaction.guild.id);
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("pause").setLabel("⏸").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("resume").setLabel("▶").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("skip").setLabel("⏭").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("bass").setLabel("🔊 Bass").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("stop").setLabel("⛔").setStyle(ButtonStyle.Danger)
    );

    interaction.reply({ content: `🎶 ${query}`, components: [row] });
  }
};
