const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer) => {
    const discord = new Discord();
    const embed = discord.embedText("💥 Cleared... ⏹");
    musicPlayer.queue.clear();
    message.channel.send({embeds: [embed]});
}