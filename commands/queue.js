const Discord = require("../modules/Discord.js");

module.exports = (message) => {
    const discord = new Discord();
    const embed = discord.embedQueue(message);
    message.channel.send({embeds: [embed]});
}