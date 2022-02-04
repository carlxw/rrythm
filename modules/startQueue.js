/**
 * File creates player and watches the player's state
 */
const { createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const player = createAudioPlayer();
const changeQueue = require("./changeSong.js");
const ytdl = require("ytdl-core");

/**
 * @return connection
 */
module.exports = startQueue = async (Discord, message, title) => {
    // Play music
    const queue = require("../index.js");
    const stream = ytdl(queue.pop()[1], { filter: "audioonly"} );
    const resource = Discord.createAudioResource(stream);
    connection.subscribe(player);
    player.play(resource);
    message.channel.send("**Playing** 🎶 `" + title + "` - Now!");
    return player;
}

player.on(AudioPlayerStatus.Idle, () => {
    changeQueue(player);
})