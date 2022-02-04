const Discord = require("@discordjs/voice");

// Function imports
const connect = require("../modules/connect.js");
const search = require("../modules/search.js");
const enqueue = require("../modules/enqueue.js");

/**
 * @return voice connection
 * @return player
 * @return queue
 */
module.exports = play = async (message, args, connection, player, queue) => {
    // No second argument (link, search keyword)
    const argument = format(args);
    if (!argument) {
        message.channel.send("❌ **There is nothing to play**");
        return [null, null, null];
    }
    // Not connected to voice channel
    else if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        return [null, null, null];
    }
    // Truthy: There is a connection and player
    else if (connection && player) {
        queue.add(argument);
    }
    // Run, join voice channel
    else {
        let stream;
        let title;
        let url;
        connection = await connect(Discord, message);
        [stream, title, url] = await search(message, argument);
        [player, queue] = await enqueue(Discord, message, stream, title, queue);
        return [connection, player, queue];
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