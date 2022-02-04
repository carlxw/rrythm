module.exports = disonnect = (message, client, connection, player) => {
    // Falsy: There is no connection
    if (!connection) {
        message.channel.send("❌ **I am not in a voice channel**");
        return [null, null];
    } else { // Truthy: There is a connection
        connection.destroy();
        player.stop();
        message.channel.send("📭 **Successfully disconnected**");
        return [null, null];
    }
}