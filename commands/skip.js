module.exports = (message, musicPlayer) => {
    if (musicPlayer) {
        if (musicPlayer.isLooped()) musicPlayer.toggleLoop();
        musicPlayer.playAudio();
        message.channel.send("⏩ **Skipped** 👍");
    }
}