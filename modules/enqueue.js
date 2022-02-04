/**
 * Adds a song to the queue
 */
module.exports = enqueue = async (message, args) => {
    const queue = require("../index.js");
    let title;
    let url;
    [title, url] = await search(args);
    message.channel.send("**✅ Added **`"+ title +"`** to queue**");
    queue.add([title, url]);
}