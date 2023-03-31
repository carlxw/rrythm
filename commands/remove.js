const config = require("../config.json");

module.exports = (message, musicPlayer, discord, num) => {
    try {
        const removedIndex = musicPlayer.queue.remove(num)
        message.channel.send({ embeds: [discord.embedText(`${config.removed_msg1} \`${removedIndex.title}\` ${removed_msg2}.`)] });
    } catch (err) {
        message.channel.send({ embeds: [discord.embedText(config.failed_remove_msg)] });
    } 

    
}