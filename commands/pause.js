const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer) => {
    musicPlayer.pause();

    const discord = new Discord();
    const embed = discord.embedText("**Paused** ⏸");
    message.channel.send({embeds: [embed]});
}