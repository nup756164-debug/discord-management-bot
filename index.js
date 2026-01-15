import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits
} from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User to kick").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User to ban").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout (mute) a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Minutes to timeout")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
];

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log("✅ Moderation commands registered");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.options.getMember("user");
  const reason = interaction.options.getString("reason") || "No reason provided";

  try {
    if (interaction.commandName === "kick") {
      await member.kick(reason);
      await interaction.reply(`👢 **${member.user.tag}** was kicked.`);
    }

    if (interaction.commandName === "ban") {
      await member.ban({ reason });
      await interaction.reply(`🔨 **${member.user.tag}** was banned.`);
    }

    if (interaction.commandName === "timeout") {
      const minutes = interaction.options.getInteger("minutes");
      await member.timeout(minutes * 60 * 1000, reason);
      await interaction.reply(
        `⏱ **${member.user.tag}** was timed out for ${minutes} minutes.`
      );
    }
  } catch (err) {
    await interaction.reply({
      content: "❌ I cannot perform that action.",
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
