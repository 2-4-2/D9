require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const app = express();

// PANEL (Railway uyumasın diye)
app.get("/", (req, res) => {
  res.send("🤖 Bot aktif");
});
app.listen(process.env.PORT || 3000);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.commands = new Collection();

// KOMUTLARI YÜKLE
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

// SLASH KOMUT REGISTER
client.once("ready", async () => {
  const commands = client.commands.map(c => c.data);
  await client.application.commands.set(commands);
  console.log("🔥 BOT AKTİF");
});

// KOMUT ÇALIŞTIR
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.log(err);
    interaction.reply("Hata oluştu");
  }
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

client.login(process.env.TOKEN);
