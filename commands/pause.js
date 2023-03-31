const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    musicPlayer.pause();
    message.channel.send({ embeds: [discord.embedText(config.paused_msg)] });
}