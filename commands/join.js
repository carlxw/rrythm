module.exports = async (message) => {
    const { connection } = require("../index.js");

    // There is no connection - create a connection
    if (!connection.getConnection()) {
        connection.createConnection(message);
        message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
    }

    // There is a connection - return
    else message.channel.send("❌ **I am already in a voice channel.**");
}