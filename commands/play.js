const MusicPlayer = require("../modules/MusicPlayer");
const Discord = require("../modules/Discord.js");

module.exports = async (message, args) => {
    let { connection } = require("../index.js");
    const discord = new Discord();
    let musicPlayer = connection.getMusicPlayer();

    // There is no argument and the player is currently paused - unpause
    if (musicPlayer && !args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    } 
    
    // User did not provide any arguments - inform user
    else if (!args) message.channel.send("❌ **There is nothing to play**");
       
    // Add a song to the queue
    else if (connection && musicPlayer && message.member.voice.channel.name === musicPlayer.getSetVChannel()) { 
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");

        try {
            await musicPlayer.enqueue(args);
        } catch (error) {
            message.channel.send("❌ **Failed to load** `Something went wrong when looking up the track`");
        }

        const embed = discord.embedAddedToQueue(message);
        message.channel.send({embeds: [embed]});
        musicPlayer.getQueue().look()[7] = discord.getUser(message);
    }

    // There is no musicPlayer, there is an argument to play - join voice channel and play song
    else if (!musicPlayer) {
        if (!connection) {
            connection.createConnection(message);
            message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        }
        musicPlayer = new MusicPlayer(message, connection);
        connection.setMusicPlayer(musicPlayer);

        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        try {
            await musicPlayer.enqueue(args);
        } catch (error) {
            message.channel.send("❌ **Failed to load** `Something went wrong when looking up the track`");
        }

        message.channel.send("**Playing** 🎶 `" + musicPlayer.getQueue().getRecentPopped().title + "` - Now!");
        musicPlayer.getQueue().getRecentPopped()[7] = discord.getUser(message);
    }
}