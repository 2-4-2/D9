const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder().setName("geç").setDescription("Geçer"),
  async execute(interaction) {
    const q = getQueue(interaction.guild.id);
    q.player.stop();
    interaction.reply("⏭️ Geçildi");
  }
};
