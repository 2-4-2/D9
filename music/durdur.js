const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder().setName("durdur").setDescription("Durdurur"),
  async execute(interaction) {
    const q = getQueue(interaction.guild.id);
    q.songs = [];
    q.player.stop();
    interaction.reply("⛔ Durduruldu");
  }
};
