module.exports = (message) => {
    const { connection } = require("../index.js");

    // Bot was never in a voice channel in the first place - inform user
    if (!connection) {
        message.channel.send("❌ **I am not in a voice channel**");
    } 
    
    // Bot has a connection to disconnect
    else if (connection){
        connection.destroyConnection();
        message.channel.send("📭 **Successfully disconnected**");
    }
}