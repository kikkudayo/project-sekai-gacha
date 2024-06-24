const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("wonderhoy")
    .setDescription("Wonderhoy!"),
  async execute(interaction) {
    await interaction.reply("Wonderhoy!");
  },
};
