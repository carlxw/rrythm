const MusicPlayer = require("../modules/MusicPlayer");
const Discord = require("../modules/Discord.js");

module.exports = async (message, args) => {
    let { connection } = require("../index.js");
    const discord = new Discord();
    let musicPlayer = connection.getMusicPlayer();

    // User is not in voice channel - inform user
    if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    
    // There is no argument and the player is currently paused - unpause
    else if (musicPlayer && !args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.unpause();
        message.channel.send("⏯ **Resuming** 👍");
    } 
    
    // User did not provide any arguments - inform user
    else if (!args) message.channel.send("❌ **There is nothing to play**");
       
    // Add a song to the queue
    else if (connection.getConnection() && musicPlayer && message.member.voice.channel.name === musicPlayer.getSetVChannel()) { 
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");

        await musicPlayer.enqueue(args);

        const embed = await discord.embedAddedToQueue(musicPlayer.getQueue(), message);
        message.channel.send({embeds: [embed]});
        musicPlayer.getQueue().look()[6] = discord.getUser(message);
    }

    // There is no connection, there is an argument to play - join voice channel and play song
    else if ((connection.getConnection() && !musicPlayer) || (!connection.getConnection() && !musicPlayer)) {
        if (!connection.getConnection()) {
            connection.createConnection(message);
            message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        }
        musicPlayer = new MusicPlayer(message, connection.getConnection());
        connection.setMusicPlayer(musicPlayer);

        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        await musicPlayer.enqueue(args);

        message.channel.send("**Playing** 🎶 `" + musicPlayer.getQueue().getRecentPopped()[1] + "` - Now!");
        musicPlayer.getQueue().getRecentPopped()[6] = discord.getUser(message);
    }
}