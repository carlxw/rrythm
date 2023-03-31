const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    musicPlayer.destroy();
    message.channel.send({ embeds: [discord.embedText(config.disconnect_msg)] });
}