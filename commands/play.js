const Discord = require("../modules/Discord.js");

module.exports = async (message, musicPlayer, args) => {
    const discord = new Discord();

    musicPlayer.enqueue(args);
    message.channel.send("Sent");
}