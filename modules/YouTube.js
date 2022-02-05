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
        return search.all[count].url;
    }

    /**
     * Method gets the title of the video given a input
     * 
     * @param {String} input The URL or keyword of video
     * @returns Title of video
     */
    async getTitle(input) {
        let info = await this.___getInfo(input);
        return info.videoDetails.title;
    }

    /**
     * Method gets the thumbnail of the video given a input
     * 
     * @param {String} input The URL or keyword of video
     * @returns Thumbnail link of video
     */
    async getThumbnail(input) {
        let info = await this.___getInfo(input);
        return info.videoDetails.thumbnails[3].url;
    }

    /**
     * Method gets the video channel of the video given a input
     * 
     * @param {String} input The URL or keyword of video
     * @returns Channel name
     */
    async getVideoChannel(input) {
        let info = await this.___getInfo(input);
        return info.videoDetails.author.name;
    }

    /**
     * Method gets the video length of the video given a input
     * 
     * @param {String} input The URL or keyword of video
     * @returns Video length in mm:ss
     */
    async getVideoLength(input) {
        let info = await this.___getInfo(input);
        return info.videoDetails.lengthSeconds;
    }

    /**
     * Method converts raw seconds into min:seconds
     * 
     * @param {Integer} seconds Duration of a video
     * @returns Formatted of mm::ss
     */
    secToMinSec(input) {
        const toMin = input/60;
        const min = Math.floor(toMin);
        const seconds = Math.floor((toMin-min)*60);
        if (seconds < 10) return `${min}:0${seconds}`;
        else return `${min}:${seconds}`;
    }
    
    async ___getInfo(input){
        let info;
        if (await this.isURL(input)) { // is URL
            info = await this.ytdl.getInfo(input);
        } else { // is keyword
            info = await this.ytdl.getInfo(await this.getURL(input));
        }
        return info;
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
        const stream = this.ytdl(url, { filter: "audioonly" });
        return stream;
    }

    /**
     * Method gets the duration of the queue
     * 
     * @param {Queue} queue Queue that contains song links
     * @returns Duration of queue formatted in mm:ss
     */
    async getQueueDuration(queue) {
        let array = queue.getArray();
        array.push(queue.getRecentPopped());
        let output = 0;
        // Store everything in one go?
        for (let i = 0; i < array.length; i++) {
            output += Number(await this.getVideoLength(array[i]));
        }
        return this.secToMinSec(output);
    }
}

module.exports = YouTube;