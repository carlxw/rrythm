const MusicPlayer = require("../modules/MusicPlayer");
const Discord = require("../modules/Discord.js");

module.exports = async (message, args) => {
    let { connection } = require("../index.js");
    const discord = new Discord();
    let musicPlayer = connection.getMusicPlayer();

    
}