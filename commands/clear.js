module.exports = (message) => {
    const { connection } = require("../index.js");
    const musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    else if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        musicPlayer.getQueue().clear();
        message.channel.send("💥 ***Cleared...*** ⏹");
    }
    
}