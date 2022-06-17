module.exports = (message) => {
    const { connection } = require("../index.js");
    
    connection.getmusicPlayer().pause();
    message.channel.send("**Paused** ⏸");
}