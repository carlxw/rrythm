/**
 * @return connection
 */
module.exports = enqueue = async (Discord, message, stream, title, queue) => {
    // Play music
    const player = Discord.createAudioPlayer();
    const resource = Discord.createAudioResource(stream);
    connection.subscribe(player);
    player.play(resource);
    message.channel.send("**Playing** 🎶 `" + title + "` - Now!");

    return [player, queue];
}