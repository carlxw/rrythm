module.exports = (message, musicPlayer) => {
    musicPlayer.queue.clear();
    message.channel.send("💥 ***Cleared...*** ⏹");
}