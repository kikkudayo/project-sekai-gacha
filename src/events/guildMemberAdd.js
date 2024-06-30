const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  execute(member) {
    console.log(`${member.user.username} is now online.`);
  },
};
