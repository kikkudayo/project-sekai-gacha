const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wonderhoy")
    .setDescription("Say Wonderhoy!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Say Wonderhoy to someone else!")
        .setRequired(false)
    ),

  async execute(interaction) {
    const interactionUserId = interaction.user.id;
    let wonderhoyTargetId = "";
    let descriptionString = "";

    if (interaction.options.getUser("user")) {
      wonderhoyTargetId = interaction.options.getUser("user").id;
      descriptionString = `<@${interactionUserId}> says Wonderhoy to <@${wonderhoyTargetId}>!`;
    } else {
      descriptionString = `<@${interactionUserId}> says Wonderhoy!`;
    }

    fs.readdir("./images/wonderhoy/", (err, wonderhoyPath) => {
      if (err) {
        console.log("hello");
      } else {
        const wonderhoyImageNumber = Math.floor(
          Math.random() * wonderhoyPath.length
        );
        const wonderhoyImage = wonderhoyPath[wonderhoyImageNumber];
        console.log(wonderhoyImage);
        let wonderhoyAttachmentImage = new AttachmentBuilder(
          `./images/wonderhoy/${wonderhoyImage}`
        );
        const wonderhoyEmbed = new EmbedBuilder()
          .setColor(0xff66bc)
          .setTitle("Wonderhoy!")
          .setDescription(`${descriptionString}`)
          .setImage(`attachment://${wonderhoyImage}`);

        interaction.reply({
          embeds: [wonderhoyEmbed],
          files: [wonderhoyAttachmentImage],
        });
      }
    });
  },
};
