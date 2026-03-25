const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder().setName("devam").setDescription("Devam eder"),
  async execute(interaction) {
    const q = getQueue(interaction.guild.id);
    q.player.unpause();
    interaction.reply("▶️ Devam");
  }
};
