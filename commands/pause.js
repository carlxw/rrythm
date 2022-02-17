module.exports = command = (message) => {
    const { connection } = require("../index.js");
    connection.getmusicPlayer().pause();
    message.channel.send("**Paused** ⏸");
}