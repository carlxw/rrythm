const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    if (musicPlayer.loop) musicPlayer.toggleLoop(); // Unloops current song
    musicPlayer.playAudio();
    message.channel.send({ embeds: [discord.embedText(config.skipped_msg)] });
}