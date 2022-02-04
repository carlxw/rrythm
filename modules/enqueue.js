/**
 * Adds a song to the queue
 */
module.exports = enqueue = async (message, args, queue) => {
    let title;
    let url;
    [title, url] = await search(args);
    message.channel.send(`added ${title} to queue`);
    queue.add([title, url]);
    return queue;
}