const Discord = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

// Voice channel connection
let connection; 

/**
 * @return Connection, player, queue
 */
module.exports = play = async (message, args) => {
    // No second argument (link, search keyword)
    const argument = format(args);
    if (!argument) {
        message.channel.send("❌ **There is nothing to play**");
        return [null, null, null];
    }
    // Not connected to voice channel
    else if (!message.member.voice.channel) {
        message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        return [null, null, null];
    }
    // Run, join voice channel
    else {
        connection = Discord.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        message.channel.send("👍 **Joined `" + message.member.voice.channel.name + "` and bound to " + message.channel.toString() + "**"); // Will need to update in future

        message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
        let stream;
        let title;
        if (ytdl.validateURL(argument)) { // URL is valid
            stream = ytdl(argument, { filter: "audioonly" });
            // Example of choosing a video format.
            const info = await ytdl.getInfo(argument);
            title = info.videoDetails.title;
        } else { // Argument is a search keyword
            const search = await yts(argument);
            stream = ytdl(search.all[0].url, { filter: "audioonly"} );
            const info = await ytdl.getInfo(search.all[0].url);
            title = info.videoDetails.title;
        }

        message.channel.send("**Playing** 🎶 `" + title + "` - Now!");
        const player = Discord.createAudioPlayer();
        const resource = Discord.createAudioResource(stream);
        connection.subscribe(player);
        player.play(resource);

        return [connection, player];
    }
}

// Formats all data in args to be one single argument
const format = (arr) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) {
        output = output + arr[i] + " ";
    }
    return output.trim();
}
