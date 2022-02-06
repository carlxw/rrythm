module.exports = command = (musicPlayer, message) => {
    musicPlayer.pause();
    message.channel.send("**Paused** ⏸");
}