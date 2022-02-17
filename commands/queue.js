const Discord = require("../modules/Discord.js");

module.exports = (musicPlayer, message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();
    if (!message.member.voice.channel || message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        const discord = new Discord();
        const embed = discord.embedQueue(musicPlayer, message);
        message.channel.send({embeds: [embed]});
    }
}