const play = require("play-dl");
const config = require("../config.json");

module.exports = async (message, musicPlayer, discord, args) => {
    // No unpause needed, and no args
    if (!args && musicPlayer.getPlayerStatus() !== "paused") return;

    // Unpause
    if (!args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.player.unpause();
        message.channel.send({ embeds: [discord.embedText(config.resuming_msg)] });
        return;
    } 

    message.channel.send({ embeds: [discord.embedText(`${config.searching_msg}: \`${args}\`.`)] }).then(
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
            else message.channel.send({embeds: [await discord.embedAddedToQueue(message)]});
        }
    );
}