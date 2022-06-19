module.exports = (message, musicPlayer, discord) => {
    if (musicPlayer.loop) musicPlayer.toggleLoop(); // Unloops current song
    musicPlayer.playAudio();
    message.channel.send({embeds: [discord.embedText("**Skipped** ⏩")]});
}