const MusicPlayer = require("../modules/MusicPlayer");

module.exports = command = async (musicPlayer, message, args) => {
    if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    } else if (!args && musicPlayer.getPlayerStatus() === "paused") {
        musicPlayer.unpause();
        message.channel.send("⏯ **Resuming** 👍");

        return musicPlayer
    } else if (!args) {
        message.channel.send("❌ **There is nothing to play**");
    } else if (!musicPlayer) { // Not running
        musicPlayer = new MusicPlayer(message);
        message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        await musicPlayer.enqueue(args);
        const queue = musicPlayer.getQueue();
        message.channel.send("**Playing** 🎶 `" + queue.getRecentPopped()[1] + "` - Now!");
        queue.getRecentPopped()[6] = message.author.username+"#"+message.author.discriminator;
        return musicPlayer;
    }
    else if (musicPlayer) { // Add song to queue
        message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
        await musicPlayer.enqueue(args);
        const embed = await musicPlayer.createEmbed();
        message.channel.send({embeds: [embed]});
        const queue = musicPlayer.getQueue();
        queue.look()[6] = message.author.username+"#"+message.author.discriminator;
        return musicPlayer;
    }
}