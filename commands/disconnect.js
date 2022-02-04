const Queue = require("../Queue.js");

/**
 * Bot to disconnect
 */
module.exports = disonnect = async (message, connection, player) => {
    let queue = require("../index.js");
    if (!connection) { // Falsy: There is no connection
        message.channel.send("❌ **I am not in a voice channel**");
        return [null, null];
    } else if (connection && !player) { // Truthy: There is a connection, no player
        connection.destroy();
        message.channel.send("📭 **Successfully disconnected**");
        queue = new Queue();
        return null;
    } else if (connection && player) { // Truthy: There is a connection and player
        connection.destroy();
        await player.stop();
        message.channel.send("📭 **Successfully disconnected**");
        queue = new Queue();
        return [null, null];
    } 
}