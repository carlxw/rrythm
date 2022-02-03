const { joinVoiceChannel } = require('@discordjs/voice');

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
        message.channel.send(`Playing: ${args[0]}!`);
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        return connection;
    }
}