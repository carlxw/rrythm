module.exports = play = (message, args) => {
    // No second argument
    if (!args[0]) message.channel.send("Provide a link!");
    // Not connected to voice channel
    else if (!message.member.voice.channel) message.channel.send("You must be in a voice channel first!");
    // Run
    else {
        message.channel.send(`Playing: ${args[0]}!`);
    }
}