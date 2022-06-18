module.exports = (message, musicPlayer) => {

    if (message.member.voice.channel.name === musicPlayer.getSetVChannel()) {
        musicPlayer.queue.clear();
        message.channel.send("💥 ***Cleared...*** ⏹");
    } 
}