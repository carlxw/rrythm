const config = require("../config.json");

module.exports = (message, musicPlayer, discord, args) => {
    // Loop single song
    if (musicPlayer.loop) { 
        // Disable loop; True! It is looped!
        musicPlayer.toggleLoop();
        message.channel.send({ embeds: [discord.embedText(config.loop_disable_msg)] });
    } else { 
        // Enable loop
        musicPlayer.toggleLoop();;
        message.channel.send({ embeds: [discord.embedText(config.loop_enable_msg)] });
    }
}