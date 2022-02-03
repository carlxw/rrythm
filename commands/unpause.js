module.exports = disonnect = (message, client, connection, player) => {
    // Falsy: There is no connection
    if (!connection) {
        message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        return;
    } else { // Truthy: There is a connection
        player.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    }
}