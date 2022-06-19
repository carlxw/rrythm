const Discord = require("../modules/Discord");

module.exports = (message, musicPlayer, num) => {
    const discord = new Discord();
    try {
        const removedIndex = musicPlayer.queue.remove(num)
        const embed = discord.embedText("**Removed** `" + removedIndex.title + "` ✅ ");
        message.channel.send({embeds: [embed]});
    } catch (err) {
        const embed = discord.embedText("❌ Failed to remove position " + num + ".");
        message.channel.send({embeds: [embed]});
    } 
}