const Discord = require("../modules/Discord.js");

// Unpause

module.exports = async (message, musicPlayer, args) => {
    const discord = new Discord();

    message.channel.send({embeds: [discord.embedText("**Searching** 🔎: `" + args + "`.")]}).then(
        async msg => {
            await musicPlayer.enqueue(message, args);
            msg.delete();
            if (musicPlayer.queue.search(musicPlayer.queue.recentAdded.title) === -1) {
                message.channel.send({embeds: [discord.embedText("**Playing** 🎶: `" + musicPlayer.queue.recentAdded.title + "`.")]})
            }
            else message.channel.send({embeds: [discord.embedAddedToQueue(message)]});
        }
    );
}