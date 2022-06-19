const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer) => {
    musicPlayer.destroy();

    const discord = new Discord();
    const embed = discord.embedText("**Successfully disconnected** 📭");
    message.channel.send({embeds: [embed]});
}