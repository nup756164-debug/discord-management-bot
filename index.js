require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  channel.send(
    `👋 Welcome **${member.user.username}** to **${member.guild.name}**!\nPlease read the rules and enjoy your stay.`
  );
});

client.login(process.env.DISCORD_TOKEN);
