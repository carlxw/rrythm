const Discord = require("../modules/Discord.js");

module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    else {
        const discord = new Discord();
        const embed = discord.embedQueue(message);
        message.channel.send({embeds: [embed]});
    }
}