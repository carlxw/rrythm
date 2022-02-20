module.exports = (message) => {
    const { connection } = require("../index.js");
    const musicPlayer = connection.getMusicPlayer();

    musicPlayer.getQueue().clear();

    message.channel.send("💥 ***Cleared...*** ⏹");
}