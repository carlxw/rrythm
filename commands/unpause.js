module.exports = unpause = (message, client, connection, player) => {
    if (player.state.status === "paused") {
        player.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    }
}