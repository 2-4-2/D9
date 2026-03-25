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

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.commands = new Collection();

// Komut yükleme
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

// Slash komut register
client.once("ready", async () => {
  await client.application.commands.set(
    client.commands.map(c => c.data)
  );
  console.log("🔥 BOT AKTİF");
});

// Slash komut
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    await cmd.execute(interaction);
  }

  // BUTONLAR
  if (interaction.isButton()) {
    const { getQueue } = require("./music/player");
    const q = getQueue(interaction.guild.id);

    if (!q) return interaction.reply({ content: "❌ Kuyruk yok", ephemeral: true });

    if (interaction.customId === "pause") {
      q.player.pause();
      interaction.reply("⏸️ Duraklatıldı");
    }

    if (interaction.customId === "resume") {
      q.player.unpause();
      interaction.reply("▶️ Devam ediyor");
    }

    if (interaction.customId === "skip") {
      q.player.stop();
      interaction.reply("⏭️ Geçildi");
    }

    if (interaction.customId === "stop") {
      q.songs = [];
      q.player.stop();
      interaction.reply("⛔ Durduruldu");
    }
  }
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

client.login(process.env.TOKEN);
