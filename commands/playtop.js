module.exports = async (message, musicPlayer, discord, args) => {
    message.channel.send({embeds: [discord.embedText("**Searching** 🔎: `" + args + "`.")]}).then(
        async msg => {
            await musicPlayer.enqueueTop(message, args);
            msg.delete();
            message.channel.send({embeds: [discord.embedAddedToQueue(message)]});
        }
    );
}