const { joinVoiceChannel } = require('@discordjs/voice');
let connection;

module.exports = play = (message, args) => {
    // No second argument
    if (!args[0]) {
        message.channel.send("Provide a link!");
        return null;
    }
    // Not connected to voice channel
    else if (!message.member.voice.channel) {
        message.channel.send("You must be in a voice channel first!");
        return null;
    }
    // Run, join voice channel
    else {
        const argument = format(args);
        message.channel.send(`Playing: ${argument}!`);
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        return connection;
    }
}

const format = (x) => {
    let output = "";
    for (let i = 0; i < x.length; i++) {
        output = output + x[i] + " ";
    }
    return output.trim();
}