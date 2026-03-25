const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/player");

module.exports = {
  data: new SlashCommandBuilder().setName("kuyruk").setDescription("Kuyruğu gösterir"),
  async execute(interaction) {
    const q = getQueue(interaction.guild.id);

    if (!q.songs.length) return interaction.reply("Boş");

    const list = q.songs.map((s, i) => `${i + 1}. ${s.title}`).join("\n");
    interaction.reply(list);
  }
};
