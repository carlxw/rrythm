const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    // Conditions for bot and user to be in a voice channel is already checked and verified
    musicPlayer.queue.shuffle();
    message.channel.send({ embeds: [discord.embedText(config.shuffle_msg)] });
}