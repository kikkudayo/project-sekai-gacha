const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `Command: ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()){
    return;
  }
  console.log(interaction);
});


client.on('messageCreate',  (message) => {
    if (message.content === "<@1250453484311154760>") {
      message.reply({
        content: 'Project Sekai Gacha is up and running!',
        allowedMentions: {
          repliedUser: false
        },
      }

      );
    }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.username} is online.`);
});

client.login(token);


