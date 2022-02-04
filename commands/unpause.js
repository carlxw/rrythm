/**
 * Unpause the player
 */
module.exports = unpause = async (message, player) => {
    if (player.state.status === "paused") {
        player.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    }
}