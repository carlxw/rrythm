module.exports = command = (musicPlayer, message) => {
    if (musicPlayer) {
        musicPlayer.___playAudio();
        message.channel.send("⏩ **Skipped** 👍");
    }
}