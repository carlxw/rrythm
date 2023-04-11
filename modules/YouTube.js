const play = require("play-dl");

// PLAYLIST IMPLEMENTATION 

/**
 * Class handles with YouTube-related methods
 */
class YouTube {
    /**
     * Acquires the necessary information given an argument
     * 
     * @param {String} argument A URL or a search keyword
     * @returns Many things... but no stream
     */
    async acquire(argument) {
        const YouTubeStream = require("./YouTubeStream.js");
        
        argument = argument.trim();
        let [ info ] = await this.#getInfo(argument);

        let link;
        if (play.yt_validate(argument) === "video") link = argument;
        else link = info.url;

        const title = info.title;
        const channelName = info.channel.name;
        const songDuration = info.durationInSec;
        const thumbnail = info.thumbnails[0].url;
        const stream = null;
        const live = info.live;
        return new YouTubeStream(link, title, channelName, songDuration, thumbnail, stream, live);
    }

    /**
     * Gets playlist data
     * @param {String} link Playlist link
     * @returns Playlist list
     */
    async acquirePlaylist(link) {
        return await play.playlist_info(link, { incomplete : true });
    }

    /**
     * Returns all videos within a playlist. Can exceed 100.
     * @param {YouTube Playlist} playlist 
     * @returns Video array
     */
    async playlist_videos(playlist) {
        return await playlist.all_videos();
    }

    /**
     * Using YTDL, returns something that is playable by discord.js/voice AudioPlayer
     * 
     * @param {String} url A URL
     * @returns AudioResource provided by YTDL
     */
    async getStream(url) {
        const { createAudioResource } = require("@discordjs/voice");

        const source = await play.stream(url, {
            quality: 0
        });

        return createAudioResource(source.stream, {
            inputType: source.type
        });
    }

    /**
     * Method accquires video information using play-dl
     * 
     * @param {String} input Search keyword or URL
     * @returns Array of data
     */
    async #getInfo(input){
        // Simple URL Detection
        if (input.includes("www.") || input.includes(".com") || input.includes("https")) {
            input = this.#detect_process_ab(input);
        }

        let yt_info = await play.search(input, {
            limit: 1
        })
        return yt_info;
    }

    /**
     * 2023-04-02: AdBlock messes with the URL by adding a "&ab_channel=" to the URL
     * which messes up with the bot's search algorithm. 
     * 
     * @param {String} link URL with possibility of containning AdBlock link
     * @returns Processed link if it does contain "&ab_channel="
     */
    #detect_process_ab(link) {
        if (!link.includes("&ab_channel=")) return link;

        // The link contains AdBlock URL parameter
        return link.split("&ab_channel=")[0];
    }
}

module.exports = YouTube;