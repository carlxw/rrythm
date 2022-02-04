/**
 * File searches for a video through search keyword or link
 * Returns an array of items
 */
const ytdl = require("ytdl-core");
const yts = require("yt-search");

/**
 * @return title of video
 * @return url of video
 */
module.exports = search = async (message, argument) => {
    // Search for youtube video
    message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
    let title;
    let url;
    if (ytdl.validateURL(argument)) { // URL is valid
        // Get title
        const info = await ytdl.getInfo(argument); 
        title = info.videoDetails.title;
        url = argument;
    } else { // Argument is a search keyword
        [title, url] = await findVideo(argument);
    }
    return [title, url];
}

// Find video, skip channels
const findVideo = async (argument) => {
    let count = 0;
    const search = await yts(argument); // Youtube Search
    while (search.all[count].type !== "video") {
        count++;
    }
    const info = await ytdl.getInfo(search.all[count].url);
    title = info.videoDetails.title;
    return [title, search.all[count].url];
}

/*
module.exports = search = async (message, argument) => {
    // Search for youtube video
    message.channel.send("🎵 **Searching** 🔎 `" + argument + "`");
    let stream;
    let title;
    let url;
    if (ytdl.validateURL(argument)) { // URL is valid
        stream = ytdl(argument, { filter: "audioonly" }); // Stream link
        // Get title
        const info = await ytdl.getInfo(argument); 
        title = info.videoDetails.title;
        url = argument;
    } else { // Argument is a search keyword
        [stream, title, url] = await findVideo(argument);
    }
    return [stream, title, url];
}
*/