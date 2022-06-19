const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer) => {
    musicPlayer.queue.clear();

    const discord = new Discord();
    const embed = discord.embedText("**Cleared** 💥");
    message.channel.send({embeds: [embed]});
}