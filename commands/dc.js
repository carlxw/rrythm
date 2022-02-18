module.exports = (message) => {
    const { connection } = require("../index.js");

    // User must be in a voice channel to use commands
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");

    // Bot was never in a voice channel in the first place - inform user
    if (!connection.getConnection()) {
        message.channel.send("❌ **I am not in a voice channel**");
    } 
    
    // Bot has a connection to disconnect
    else {
        connection.destroyConnection();
        message.channel.send("📭 **Successfully disconnected**");
    }
}