const MusicPlayer = require("../modules/MusicPlayer");
const Discord = require("../modules/Discord.js");

module.exports = command = async (musicPlayer, message, args) => {
    const discord = new Discord();

    if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        return musicPlayer;
    } else if (!args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.unpause();
        message.channel.send("⏯ **Resuming** 👍");
        return musicPlayer;
    } else if (!args) {
        message.channel.send("❌ **There is nothing to play**");
        return musicPlayer;
    } else if (!musicPlayer) { // Not running
        musicPlayer = new MusicPlayer(message);
        message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        await musicPlayer.enqueue(args);
        message.channel.send("**Playing** 🎶 `" + musicPlayer.getQueue().getRecentPopped()[1] + "` - Now!");
        musicPlayer.getQueue().getRecentPopped()[6] = discord.getUser(message);
        return musicPlayer;
    }
    else if (musicPlayer && message.member.voice.channel.name === musicPlayer.getSetChannel()) { // Add song to queue
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        await musicPlayer.enqueue(args);
        const embed = await discord.embedAddedToQueue(musicPlayer.getQueue(), message);
        message.channel.send({embeds: [embed]});
        musicPlayer.getQueue().look()[6] = discord.getUser(message);
        return musicPlayer;
    }
}