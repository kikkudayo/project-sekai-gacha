
const { Client, Events, GatewayIntentBits, userMention } = require('discord.js');
const { token } = require('./config.json')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
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

// Log in to Discord with your client's token
client.login(token);
