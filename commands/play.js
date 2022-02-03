const Discord = require("@discordjs/voice");

// Voice channel connection
let connection; 

/**
 * @return voice connection
 */
module.exports = play = (message, args) => {
    // No second argument (link, search keyword)
    const argument = format(args);
    if (!argument) {
        message.channel.send("❌ **There is nothing to play**");
        return null;
    }
    // Not connected to voice channel
    else if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        return null;
    }
    // Run, join voice channel
    else {
        message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
        message.channel.send("**Playing** 🎶 `" + argument + "` - Now!");

        connection = Discord.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        const player = Discord.createAudioPlayer();
        const resource = Discord.createAudioResource("https://discord.com/channels/938100003224829952/938100003677810728/938885655763750994");
        
        player.play(resource);
        connection.subscribe(player);
        return connection;
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