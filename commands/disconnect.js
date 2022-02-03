module.exports = disonnect = (message, client, connection) => {
    // Close connection if in a voice chat
    if (!connection) {
        return;
    } else {
        connection.destroy();
    }
}