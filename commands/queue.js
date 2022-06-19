module.exports = (message, musicPlayer, discord) => {
    message.channel.send({embeds: [discord.embedQueue(message)]});
}