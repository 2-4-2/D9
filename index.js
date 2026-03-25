require("dotenv").config();
const fs = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { getQueue } = require("./music/player");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.commands = new Collection();

fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

client.once("ready", async () => {
  await client.application.commands.set(client.commands.map(c => c.data));
  console.log("🔥 Bot aktif");
});

client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction);
  }

  if (interaction.isButton()) {
    const q = getQueue(interaction.guild.id);
    if (!q) return interaction.reply({ content: "❌ Kuyruk yok", ephemeral: true });

    switch (interaction.customId) {
      case "pause": q.player.pause(); interaction.reply("⏸ Duraklatıldı"); break;
      case "resume": q.player.unpause(); interaction.reply("▶ Devam"); break;
      case "skip": q.player.stop(); interaction.reply("⏭ Geçildi"); break;
      case "stop": q.songs=[]; q.player.stop(); interaction.reply("⛔ Durduruldu"); break;
      case "bass": q.bass=!q.bass; interaction.reply(q.bass ? "🔊 Bass Açıldı" : "🔊 Bass Kapandı"); break;
    }
  }
});

client.login(process.env.TOKEN);
