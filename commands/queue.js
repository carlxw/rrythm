const Discord = require("../modules/Discord.js");

module.exports = (musicPlayer, message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    
    if (!message.member.voice.channel || message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        const discord = new Discord();
        const embed = discord.embedQueue(musicPlayer, message);
        message.channel.send({embeds: [embed]});
    }
}