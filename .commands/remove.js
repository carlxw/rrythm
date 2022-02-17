module.exports = command = (musicPlayer, message, num) => {
    try {
        if (!message.member.voice.channel || !message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
            const array = musicPlayer.getQueue().getArrayReference();
            const removedIndex = array[num-1];
            array.splice(num-1, 1)
            message.channel.send("✅ **Removed** `" + removedIndex[1] + "`");
        }
    } catch (error) {
        console.log("error")
        return;
    }
}

// If the user is not in a voice channel, or in the set voice channel: Ignore