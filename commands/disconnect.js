module.exports = command = (musicPlayer, message) => {
    if (!musicPlayer) {
        message.channel.send("❌ **I am not in a voice channel**");
    } else {
        musicPlayer.disconnect();
        message.channel.send("📭 **Successfully disconnected**");
        return null;
    }
}