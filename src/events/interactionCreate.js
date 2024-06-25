const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
    console.error(`${interaction.commandName} is not a valid command.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: `Error: ${interaction.commandName} was not executed`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Error: ${interaction.commandName} was not executed`,
          ephemeral: true,
        });
      }
    }
  },
};