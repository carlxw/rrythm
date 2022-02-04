const Discord = require("@discordjs/voice");
const ytdl = require("ytdl-core");

// Voice channel connection
let connection; 

/**
 * @return voice connection
 */
module.exports = play = async (message, args, client) => {
    // No second argument (link, search keyword)
    const argument = format(args);
    if (!argument) {
        message.channel.send("❌ **There is nothing to play**");
        return [null, null];
    }
    // Not connected to voice channel
    else if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        return [null, null];
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
            let info = await ytdl.getInfo(argument);
            title = info.videoDetails.title;
        } else { // Argument is a search keyword
            stream = ("./music.mp3");
            title = "Lost My Pieces";
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