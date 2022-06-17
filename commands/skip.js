module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();
    
    if (musicPlayer) {
        if (musicPlayer.isLooped()) musicPlayer.toggleLoop();
        musicPlayer.___playAudio();
        message.channel.send("⏩ **Skipped** 👍");
    }
}