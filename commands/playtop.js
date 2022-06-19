const Discord = require("../modules/Discord.js");

module.exports = async (message, musicPlayer, args) => {
    const discord = new Discord();
    message.channel.send({embeds: [discord.embedText("**Searching** 🔎: `" + args + "`.")]}).then(
        async msg => {
            await musicPlayer.enqueueTop(message, args);
            msg.delete();
            message.channel.send({embeds: [discord.embedAddedToQueue(message)]});
        }
    );
}