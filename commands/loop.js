module.exports = (message, musicPlayer, discord, args) => {
    // Loop single song
    if (musicPlayer.loop) { // Disable loop; True! It is looped!
        musicPlayer.toggleLoop();
        message.channel.send({embeds: [discord.embedText("**Disabled!** 🔂")]});
    } else { // Enable loop
        musicPlayer.toggleLoop();;
        message.channel.send({embeds: [discord.embedText("**Enabled!** 🔂")]});
    }
}