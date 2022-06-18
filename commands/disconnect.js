module.exports = (message, musicPlayer) => {
    musicPlayer.destroy();
    message.channel.send("📭 **Successfully disconnected**");
}