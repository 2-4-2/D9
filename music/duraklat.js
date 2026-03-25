const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder().setName("duraklat").setDescription("Duraklatır"),
  async execute(interaction) {
    const q = getQueue(interaction.guild.id);
    q.player.pause();
    interaction.reply("⏸️ Duraklatıldı");
  }
};
