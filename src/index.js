
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on('messageCreate',  (message) => {
    if(message.content === 'Wonderhoy'){
        message.reply('Wonderhoy!');   
    }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.username} is online.`);
});

// Log in to Discord with your client's token
client.login(token);
