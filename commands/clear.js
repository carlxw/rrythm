module.exports = (message) => {
    const { connection } = require("../index.js");
    const musicPlayer = connection.getMusicPlayer();

    if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        musicPlayer.getQueue().clear();
        message.channel.send("💥 ***Cleared...*** ⏹");
    } 
}