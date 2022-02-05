/**
 * Class handles with YouTube-related methods
 */
class YouTube {
    constructor() {
        this.ytdl = require("ytdl-core");
        this.yts = require("yt-search");
    }

    /**
     * Method gets the URL of a given video title
     * 
     * @param {String} argument Video title
     * @returns URL
     */
    async getURL(argument) {
        let count = 0;
        const search = await this.yts(argument); // Youtube Search
        while (search.all[count].type !== "video") {
            count++;
        }
        const info = await this.ytdl.getInfo(search.all[count].url);
        return search.all[count].url;
    }

    /**
     * Method gets the title of the video given a URL
     * 
     * @param {String} url The URL of the video
     * @returns Title of URL
     */
    async getTitle(url) {
        const info = await this.ytdl.getInfo(url); 
        return info.videoDetails.title;
    }

    /**
     * Method checks if the argument is a url or not
     * 
     * @param {String} argument Video title, or URL
     * @returns boolean
     */
    async isURL(argument) {
        return this.ytdl.validateURL(argument);
    }

    /**
     * Using YTDL, returns something that is playable by discord.js/voice AudioPlayer
     * 
     * @param {String} x A title or a URL
     * @returns AudioResource provided by YTDL
     */
    async getStream(url) {
        const stream = this.ytdl(url, { filter: "audioonly"} );
        return stream;
    }
}

module.exports = YouTube;