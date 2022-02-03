module.exports = disonnect = (message, client, connection) => {
    // Falsy: There is no connection
    if (!connection) {
        return;
    } else { // Truthy: There is a connection
        connection.destroy();
        message.channel.send("📭 **Successfully disconnected**");
    }
}