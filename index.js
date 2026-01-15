import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔧 CONFIG
const WELCOME_CHANNEL_ID = "1458066108312453286";

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("🎉 Welcome!")
    .setDescription(
      `Welcome **${member.user.username}** to **${member.guild.name}**!\n\n` +
      `👤 Member #${member.guild.memberCount}\n` +
      `📅 Account created: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: "Enjoy your stay!" })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);
