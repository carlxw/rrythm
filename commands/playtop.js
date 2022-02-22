const Discord = require("../modules/Discord.js");

module.exports = async (message, args) => {
    const { connection } = require("../index.js");
    let musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    else if (connection.getConnection() && musicPlayer && message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        try {
            await musicPlayer.enqueue(args);
        } catch (error) {
            message.channel.send("❌ **Failed to load** `Something went wrong when looking up the track`");
        }

        const discord = new Discord();
        const embed = discord.embedAddedToQueueTop(message);
        message.channel.send({embeds: [embed]});
        musicPlayer.getQueue().peek()[7] = discord.getUser(message);
    }
}