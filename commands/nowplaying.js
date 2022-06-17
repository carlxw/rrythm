const Discord = require("../modules/Discord.js");

module.exports = (message) => {
    const { connection } = require("../index.js");
    const musicPlayer = connection.getMusicPlayer();
    const discord = new Discord();

    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    else if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        if (connection.getMusicPlayer().getQueue().getRecentPopped().isLive) return; // Update
        else {
            const embed = discord.embedNowPlaying();
            message.channel.send({embeds: [embed]});
        }
    }
}