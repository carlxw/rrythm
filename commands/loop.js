module.exports = (message) => {
    const { connection } = require("../index.js");
    musicPlayer = connection.getMusicPlayer();

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