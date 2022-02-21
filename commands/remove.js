module.exports = (message, num) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    
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