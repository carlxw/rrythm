module.exports = (message, musicPlayer, discord) => {
    musicPlayer.pause();
    message.channel.send({embeds: [discord.embedText("**Paused** ⏸")]});
}