module.exports = pause = (message, client, connection, player, x) => {
    // Falsy: There is no connection
    if (!connection) {
        message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        return;
    } else { // Truthy: There is a connection
        player.pause();
        message.channel.send("**Paused** ⏸");
        return true;
    }
}