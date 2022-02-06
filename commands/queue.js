const Discord = require("../modules/Discord.js");

module.exports = command = (musicPlayer, message) => {
    const discord = new Discord();
    const embed = discord.embedQueue(musicPlayer, message);
    message.channel.send({embeds: [embed]});
}