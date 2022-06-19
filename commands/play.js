const play = require("play-dl");

module.exports = async (message, musicPlayer, discord, args) => {
    // Unpause
    if (!args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.player.unpause();
        message.channel.send({embeds: [discord.embedText("**Resuming** 👍 ⏯")]});
        return;
    }

    message.channel.send({embeds: [discord.embedText("**Searching** 🔎: `" + args + "`.")]}).then(
        async msg => {
            
            // Playlist
            if (play.yt_validate(args) === "playlist") {
                const playlist = await musicPlayer.enqueuePlaylist(message, args);
                msg.delete()
                message.channel.send({embeds: [discord.embedPlaylist(message, playlist)]});
                return;
            }

            // Single video
            await musicPlayer.enqueue(message, args);
            msg.delete();
            if (musicPlayer.queue.search(musicPlayer.queue.recentAdded.title) === -1) {
                message.channel.send({embeds: [discord.embedPlay(message)]});
            }
            else message.channel.send({embeds: [discord.embedAddedToQueue(message)]});
        }
    );
}