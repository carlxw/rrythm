module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();
    
    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    
    if (musicPlayer) {
        if (musicPlayer.isLooped()) musicPlayer.toggleLoop();
        musicPlayer.___playAudio();
        message.channel.send("⏩ **Skipped** 👍");
    }
}