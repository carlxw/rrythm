module.exports = disonnect = (message, client, connection, player, x) => {
    if (x) { // Truthy: There is a connection
        player.unpause();
        message.channel.send("⏯ **Resuming** 👍");
        return false;
    }
}