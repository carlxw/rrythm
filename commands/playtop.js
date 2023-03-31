const config = require("../config.json");

module.exports = async (message, musicPlayer, discord, args) => {
    message.channel.send({ embeds: [discord.embedText(`${config.searching_msg}: \`${args}\`.`)] }).then(
        async msg => {
            await musicPlayer.enqueueTop(message, args);
            msg.delete();
            message.channel.send({ embeds: [await discord.embedAddedToQueue(message)] });
        }
    );
}