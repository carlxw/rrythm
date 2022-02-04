module.exports = disonnect = (message, client, connection, player) => {
    if (player.state.status === "playing") {
        player.pause();
        message.channel.send("**Paused** ⏸");
    } else {
        message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
    }
}