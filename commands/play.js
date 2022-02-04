const Discord = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

// Voice channel connection
let connection; 

/**
 * @return voice connection
 * @return player
 * @return queue
 */
module.exports = play = async (message, args, connection, player, queue) => {
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
    // Truthy: There is a connection and player
    else if (connection && player) {
        queue.add(argument);
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
            stream = ytdl(argument, { filter: "audioonly" }); // Stream link
            // Get title
            const info = await ytdl.getInfo(argument); 
            title = info.videoDetails.title;
        } else { // Argument is a search keyword
            [stream, title] = await findVideo(argument);
        }
        // queue.add(argument); // Adds argument to queue

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

const findVideo = async (argument) => {
    let count = 0;
    const search = await yts(argument); // Youtube Search
    while (search.all[count].type !== "video") {
        count++;
    }
    stream = ytdl(search.all[count].url, { filter: "audioonly"} ); // Stream link
    const info = await ytdl.getInfo(search.all[count].url);
    title = info.videoDetails.title;
    return [stream, title];
}