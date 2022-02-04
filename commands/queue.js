module.exports = queue = async (message, args, queue) => {
    if (player.state.status === "paused") {
        player.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    }
}