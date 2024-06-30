const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pull")
    .setDescription("Pull for a character.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Enter the amount of pulls to be performed.")
    ),

  async execute(interaction) {
    // --- Pulling for a character ---

    let rarityFourStar = 0.03;
    let rarityThreeStar = 0.085;
    let rarityTwoStar = 0.885; 
    let guaranteedThreeStar = 0;
    let pullAmount = interaction.options.getNumber("amount");
    let pulls = [];

    // Adds a guaranteed 3-star pull for every 10 pull.
    if (pullAmount >= 10) {
      guaranteedThreeStar = pullAmount / 10;
      for (let i = 1; i <= ~~guaranteedThreeStar; i++) {
        pulls.push("3 (Guaranteed)");
        pullAmount -= 1;
      }
    }

    // Generate rarity of pulls.
    for (let i = 0; i < pullAmount; i++) {
      let randomPullPercentage = Math.random();
      if (randomPullPercentage < rarityFourStar) {
        pulls.push("4");
      } else if (randomPullPercentage < rarityFourStar + rarityThreeStar) {
        pulls.push("3");
      } else {
        pulls.push("2");
      }
    }

    // --- Pulling Result Embed ---

    const pullResultEmbed = new EmbedBuilder()
      .setTitle("Project Sekai Gacha")
      .setDescription("Check the console for the results of your pulls.");
    // --- Send Result Embed ---
    interaction.reply({
      embeds: [pullResultEmbed],
    });

    console.log(pulls);
  },
};
