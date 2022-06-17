module.exports = (message, num) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

    try {
        if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
            const removedIndex = musicPlayer.getQueue().remove(num)
            message.channel.send("✅ **Removed** `" + removedIndex[1] + "`");
        }
    } catch (error) {
        console.log("error")
        return;
    }
}

// If the user is not in a voice channel, or in the set voice channel: Ignore