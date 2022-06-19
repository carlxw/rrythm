const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer) => {
    if (musicPlayer.isLooped()) musicPlayer.toggleLoop(); // Unloops current song
    musicPlayer.playAudio();

    const discord = new Discord();
    const embed = discord.embedText("**Skipped** ⏩");
    message.channel.send({embeds: [embed]});
}