module.exports = (message, musicPlayer, discord) => {
    if (musicPlayer.queue.length() < 20) message.channel.send({embeds: [discord.embedQueue(message)]});
    
    const loop = Math.ceil(musicPlayer.queue.length() / 20);

    for (let i = 0; i < loop; i++) {
        message.channel.send({embeds: [discord.embedQueue(message, i+1)]});
    }
}