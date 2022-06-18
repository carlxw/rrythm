module.exports = (message, musicPlayer) => {
    if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        if (musicPlayer.isLooped()) { // Disable loop
            musicPlayer.toggleLoop();
            message.channel.send("🔂 **Disabled!**");
        } else { // Enable loop
            musicPlayer.toggleLoop();
            message.channel.send("🔂 **Enabled!**");
        }
    }
}