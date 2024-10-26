const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs").promises;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pull")
    .setDescription("Pull for a character.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Enter the amount of pulls to be performed.")
        .setRequired(true)
        .setMaxValue(10)
        .setMinValue(1)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // Defer the reply while we process

    try {
      const pullAmount = interaction.options.getNumber("amount") || 1; // Default to 1 if undefined

      // Validation check
      if (!pullAmount || pullAmount < 1 || pullAmount > 10) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Project Sekai Gacha")
              .setDescription(
                "Invalid pull amount. Please enter a number between 1 and 10."
              )
              .setColor("#CC0000"),
          ],
        });
      }

      // Pull rates
      const rarityFourStar = 0.03;
      const rarityThreeStar = 0.085;
      let remainingPulls = pullAmount;
      const rarityPulls = [];
      const pulls = [];

      // Generate rarities first
      if (pullAmount >= 10) {
        const guaranteedThreeStar = Math.floor(pullAmount / 10);
        for (let i = 0; i < guaranteedThreeStar; i++) {
          rarityPulls.push("☆☆☆");
          remainingPulls--;
        }
      }

      for (let i = 0; i < remainingPulls; i++) {
        const random = Math.random();
        if (random < rarityFourStar) {
          rarityPulls.push("☆☆☆☆");
        } else if (random < rarityFourStar + rarityThreeStar) {
          rarityPulls.push("☆☆☆");
        } else {
          rarityPulls.push("☆☆");
        }
      }

      // Read cards data
      const cardsData = JSON.parse(
        await fs.readFile("src/commands/gacha/cards.json", "utf8")
      );

      // Map rarities to card types
      const rarityMap = {
        "☆☆☆☆": "rarity_4",
        "☆☆☆": "rarity_3",
        "☆☆": "rarity_2",
      };

      // Character mapping
      const characterNames = {
        1: "Hoshino Ichika",
        2: "Tenma Saki",
        3: "Mochizuki Honami",
        4: "Hinomori Shiho",
        5: "Hanasato Minori",
        6: "Kiritani Haruka",
        7: "Momoi Airi",
        8: "Hinomori Shizuku",
        9: "Azusawa Kohane",
        10: "Shiraishi An",
        11: "Shinonome Akito",
        12: "Aoyagi Toya",
        13: "Tenma Tsukasa",
        14: "Otori Emu",
        15: "Kusanagi Nene",
        16: "Kamishiro Rui",
        17: "Yoisaki Kanade",
        18: "Asahina Mafuyu",
        19: "Shinonome Ena",
        20: "Akiyama Mizuki",
        21: "Hatsune Miku",
        22: "Kagamine Rin",
        23: "Kagamine Len",
        24: "Megurine Luka",
        25: "MEIKO",
        26: "KAITO",
      };

      // Process pulls
      for (const rarity of rarityPulls) {
        const rarityType = rarityMap[rarity];
        const availableCards = cardsData.filter(
          (card) => card.cardRarityType === rarityType
        );

        if (availableCards.length > 0) {
          const selectedCard =
            availableCards[Math.floor(Math.random() * availableCards.length)];
          pulls.push({
            cardName: selectedCard.prefix || "Unknown Card",
            characterName:
              characterNames[selectedCard.characterId] || "Unknown Character",
            rarity: rarity,
          });
        }
      }

      if (pulls.length === 0) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Project Sekai Gacha")
              .setDescription("No cards were pulled. Please try again.")
              .setColor("#CC0000"),
          ],
        });
      }

      // Initialize display
      let currentIndex = 0;

      // Define buttons with explicit null checks
      const paginationButton = new ButtonBuilder()
        .setCustomId("pagination")
        .setLabel(`1/${pulls.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const leftButton = new ButtonBuilder()
        .setCustomId("left")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const rightButton = new ButtonBuilder()
        .setCustomId("right")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pulls.length <= 1);

      const listButton = new ButtonBuilder()
        .setCustomId("list")
        .setEmoji("🔢")
        .setStyle(ButtonStyle.Primary);

      const buttonRow = new ActionRowBuilder().addComponents(
        paginationButton,
        leftButton,
        rightButton,
        listButton
      );

      // Define display properties
      const rarityColor = {
        "☆☆☆☆": "#FF69B4",
        "☆☆☆": "#FFD700",
        "☆☆": "#ADD8E6",
      };

      const rarityStar = {
        "☆☆☆☆":
          "https://sekai.best/assets/rarity_star_afterTraining-CUlLhfpl.png",
        "☆☆☆":
          "https://sekai.best/assets/rarity_star_afterTraining-CUlLhfpl.png",
        "☆☆": "https://sekai.best/assets/rarity_star_normal-BYSplh9m.png",
      };
      
      const rarityCardIcon = {
        "☆☆☆☆": "https://i.imgur.com/xKiVtYR.png",
        "☆☆☆": "https://i.imgur.com/9UOZAH8.png",
        "☆☆": "https://i.imgur.com/B1jzhoV.png",
      };

      // Create initial embed
      const currentPull = pulls[0];
      const initialEmbed = new EmbedBuilder()
        .setColor(rarityColor[currentPull.rarity])
        .setTitle("Project Sekai Gacha")
        .setThumbnail(rarityCardIcon[currentPull.rarity])
        .addFields(
          { name: "Card Name", value: currentPull.cardName, inline: false },
          { name: "Rarity", value: currentPull.rarity, inline: false },
          { name: "Character", value: currentPull.characterName, inline: false }
        )
        .setImage(rarityStar[currentPull.rarity])
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      // Send initial message
      const message = await interaction.editReply({
        embeds: [initialEmbed],
        components: [buttonRow],
      });

      // Create collector
      const collector = message.createMessageComponentCollector({
        time: 60000,
      });

      // Handle button interactions
      collector.on("collect", async (i) => {
        // Verify interaction user
        if (i.user.id !== interaction.user.id) {
          return i.reply({
            content: "You can't use these buttons.",
            ephemeral: true,
          });
        }

        // Handle button clicks
        if (i.customId === "left" && currentIndex > 0) {
          currentIndex--;
        } else if (i.customId === "right" && currentIndex < pulls.length - 1) {
          currentIndex++;
        } else if (i.customId === "list") {
          // Handle list view
          const listEmbed = new EmbedBuilder()
            .setTitle("Project Sekai Gacha")
            .addFields(
              pulls.map((pull, index) => ({
                name: `${pull.rarity}`,
                value: `${pull.characterName} - ${pull.cardName}`,
                inline: false, // Set to true if you want fields side by side
              }))
            )

            .setColor("#37CAB3")
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
          await i.update({ embeds: [listEmbed], components: [buttonRow] });
          return;
        }

        // Update embed
        const pull = pulls[currentIndex];
        const updatedEmbed = new EmbedBuilder()
          .setColor(rarityColor[pull.rarity])
          .setTitle("Project Sekai Gacha")
          .setThumbnail(rarityCardIcon[pull.rarity])
          .addFields(
            { name: "Card Name", value: pull.cardName, inline: false },
            { name: "Rarity", value: pull.rarity, inline: false },
            { name: "Character", value: pull.characterName, inline: false }
          )
          .setImage(rarityPulls[pull.rarity])
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        // Update buttons
        paginationButton.setLabel(`${currentIndex + 1}/${pulls.length}`);
        leftButton.setDisabled(currentIndex === 0);
        rightButton.setDisabled(currentIndex === pulls.length - 1);

        const updatedRow = new ActionRowBuilder().addComponents(
          paginationButton,
          leftButton,
          rightButton,
          listButton
        );

        await i.update({
          embeds: [updatedEmbed],
          components: [updatedRow],
        });
      });

      // Handle collector end
      collector.on("end", async () => {
        const endEmbed = new EmbedBuilder()
          .setTitle("Project Sekai Gacha")
          .setDescription("This interaction has expired.")
          .setColor("#FF0033");

        await interaction.editReply({
          embeds: [endEmbed],
          components: [],
        });
      });
    } catch (error) {
      console.error("Error:", error);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("An error occurred while processing your request.")
            .setColor("#FF0000"),
        ],
        components: [],
      });
    }
  },
};
