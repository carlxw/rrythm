module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");

    if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        if (musicPlayer.isLooped()) { // Disable loop
            musicPlayer.toggleLoop();
            message.channel.send("🔂 **Disabled!**");
        } else { // Enable loop
            musicPlayer.toggleLoop();
            message.channel.send("🔂 **Enabled!**");
        }
    }
}