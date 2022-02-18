module.exports = (message) => {
    const { connection } = require("../index.js");
    
    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");

    connection.getmusicPlayer().pause();
    message.channel.send("**Paused** ⏸");
}