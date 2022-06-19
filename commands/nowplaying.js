const Discord = require("../modules/Discord.js");

module.exports = (message, musicPlayer) => {
    const discord = new Discord();

    if (musicPlayer.queue.getRecentPopped().isLive) return; // Update
    else {
        const embed = discord.embedNowPlaying();
        message.channel.send({embeds: [embed]});
    }
}