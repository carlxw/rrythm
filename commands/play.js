module.exports = async (message, musicPlayer, discord, args) => {
    // Unpause
    if (!args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.player.unpause();
        message.channel.send({embeds: [discord.embedText("**Resuming** 👍 ⏯")]});
        return;
    }

    message.channel.send({embeds: [discord.embedText("**Searching** 🔎: `" + args + "`.")]}).then(
        async msg => {
            await musicPlayer.enqueue(message, args);
            msg.delete();
            if (musicPlayer.queue.search(musicPlayer.queue.recentAdded.title) === -1) {
                message.channel.send({embeds: [discord.embedPlay(message)]});
            }
            else message.channel.send({embeds: [discord.embedAddedToQueue(message)]});
        }
    );
}