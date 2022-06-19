module.exports = (message, musicPlayer, discord) => {
    musicPlayer.queue.clear();
    message.channel.send({embeds: [discord.embedText("**Cleared** 💥")]});
}