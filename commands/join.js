module.exports = async (message) => {
    const { connection } = require("../index.js");
    // Member is not in voice channel - inform user
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");

    // There is no connection - create a connection
    else if (!connection.getConnection()) {
        connection.createConnection(message);
        message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
    }

    // There is a connection - return
    else message.channel.send("❌ **I am already in a voice channel.**");
}