const Discord = require("../modules/Discord.js");

module.exports = command = (musicPlayer, message) => {
    if (!message.member.voice.channel || message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        const discord = new Discord();
        const embed = discord.embedQueue(musicPlayer, message);
        message.channel.send({embeds: [embed]});
    }
}