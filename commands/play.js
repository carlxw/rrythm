/**
 * Does to many things, but take a guess what this file does
 */
const Discord = require("@discordjs/voice");

// Function imports
const connect = require("../modules/connect.js");
const search = require("../modules/search.js");
const startQueue = require("../modules/startQueue.js");
const enqueue = require("../modules/enqueue.js");

/**
 * @return voice connection
 * @return player
 * @return queue
 */
module.exports = play = async (message, args, connection, player) => {
    const queue = require("../index.js");
    let title;
    let url;
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
        message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
        await enqueue(message, argument, player)
        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
    }
    // Truthy: There is a connection, but no player
    else if (connection && !player) {
        message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
        [title, url] = await search(argument);
        queue.add([title, url]);
        player = await startQueue(Discord, message, title);
        return player;
    }
    // Run, join voice channel
    else {
        connection = await connect(Discord, message);
        message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
        [title, url] = await search(argument);
        queue.add([title, url]);
        player = await startQueue(Discord, message, title);
        return [connection, player];
    }
}

// Formats all data in args to be one single argument
