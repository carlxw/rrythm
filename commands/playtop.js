const Discord = require("../modules/Discord.js");

module.exports = async (message, args) => {
    const { connection } = require("../index.js");
    let musicPlayer = connection.getMusicPlayer();

    if (connection && musicPlayer && message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        try {
            message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
            await musicPlayer.enqueueTop(args);
        } catch (error) {
            message.channel.send("❌ **Failed to load** `Something went wrong when looking up the track`");
        }

        const discord = new Discord();
        const embed = discord.embedAddedToQueue(message);
        message.channel.send({embeds: [embed]});
        musicPlayer.getQueue().peek().requestedBy = discord.getUser(message);
    }
}