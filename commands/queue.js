const config = require("../config.json");

module.exports = (message, musicPlayer, discord) => {
    // One page is needed
    if (musicPlayer.queue.length() < 20) {
        message.channel.send({ embeds: [discord.embedQueue(message)] });
        return;
    }
    
    // Multiple pages are needed
    const loop = Math.ceil(musicPlayer.queue.length() / 20);
    for (let i = 0; i < loop; i++) {
        message.channel.send({ embeds: [discord.embedQueue(message, i+1)] });
    }
}