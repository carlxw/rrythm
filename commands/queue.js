const Discord = require("../modules/Discord.js");

module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();
    
    const discord = new Discord();
    const embed = discord.embedQueue(message);
    message.channel.send({embeds: [embed]});
}