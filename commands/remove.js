module.exports = (message, musicPlayer, num) => {

    try {
        if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
            const removedIndex = musicPlayer.queue.remove(num)
            message.channel.send("✅ **Removed** `" + removedIndex[1] + "`");
        }
    } catch (error) {
        console.log("error")
        return;
    }
}

// If the user is not in a voice channel, or in the set voice channel: Ignore