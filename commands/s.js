module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();
    
    if (musicPlayer) {
        musicPlayer.___playAudio();
        message.channel.send("⏩ **Skipped** 👍");
    }
}