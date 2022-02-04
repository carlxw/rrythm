const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = join = (message) => {
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false
    });
    message.channel.send("👍 **Joined `" + message.member.voice.channel.name + "` and bound to " + message.channel.toString() + "**"); // Will need to update in future
    return connection;
}