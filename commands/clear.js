const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    musicPlayer.queue.clear();
    message.channel.send({ embeds: [discord.embedText(config.clear_msg)] });
}