module.exports = (message, musicPlayer, discord, num) => {
    try {
        const removedIndex = musicPlayer.queue.remove(num)
        message.channel.send({embeds: [discord.embedText("**Removed** `" + removedIndex.title + "` ✅ ")]});
    } catch (err) {
        message.channel.send({embeds: [discord.embedText("❌ Failed to remove item.")]});
    } 
}