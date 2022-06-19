module.exports = (message, musicPlayer) => {
    musicPlayer().pause();
    message.channel.send("**Paused** ⏸");
}