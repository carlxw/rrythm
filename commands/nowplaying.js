module.exports = (message, musicPlayer, discord) => {
    if (musicPlayer.queue.recentPopped.isLive) return; // Update
    else {
        message.channel.send({ embeds: [discord.embedNowPlaying()] });
    }
}