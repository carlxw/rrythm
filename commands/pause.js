module.exports = (message, musicPlayer) => {
    connection.getmusicPlayer().pause();
    message.channel.send("**Paused** ⏸");
}