module.exports = disonnect = (message, client, connection) => {
    // Falsy: There is no connection
    if (!connection) {
        message.channel.send("❌ **I am not in a voice channel**");
        return;
    } else { // Truthy: There is a connection
        connection.destroy();
        message.channel.send("📭 **Successfully disconnected**");
    }
}