const MusicPlayer = require("../modules/MusicPlayer.js");

module.exports = command = (musicPlayer, message) => {
    if (!musicPlayer) {
        musicPlayer = new MusicPlayer(message);
        message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        return musicPlayer;
    }
}