module.exports = (message, musicPlayer, discord) => {
    musicPlayer.destroy();
    message.channel.send({embeds: [discord.embedText("**Successfully disconnected** 📭")]});
}