require("dotenv").config();
const fs = require("fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getQueue, playSong } = require("./music/player");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.commands = new Collection();

// Komutları yükle
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

// Komutları kaydet
client.once("ready", async () => {
  await client.application.commands.set(client.commands.map(c => c.data));
  console.log("🔥 Bot aktif");
});

// Slash komut ve buton kontrol
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction);
  }

  if (interaction.isButton()) {
    const q = getQueue(interaction.guild.id);
    if (!q) return interaction.reply({ content: "❌ Kuyruk yok", ephemeral: true });

    if (interaction.customId === "pause") q.player.pause() && interaction.reply("⏸ Duraklatıldı");
    if (interaction.customId === "resume") q.player.unpause() && interaction.reply("▶ Devam");
    if (interaction.customId === "skip") q.player.stop() && interaction.reply("⏭ Geçildi");
    if (interaction.customId === "stop") { q.songs=[]; q.player.stop(); interaction.reply("⛔ Durduruldu"); }
    if (interaction.customId === "bass") { q.bass=!q.bass; interaction.reply(q.bass ? "🔊 Bass Açıldı" : "🔊 Bass Kapandı"); }
  }
});

client.login(process.env.TOKEN);
