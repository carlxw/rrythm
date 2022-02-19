const play = require("play-dl");

/**
 * Class handles with YouTube-related methods
 */
class YouTube {
    /**
     * 
     * @param {String} argument A URL or a search keyword
     * @returns Title of video, 
     */
    async acquire(argument) {
        let info = await this.___getInfo(argument);

        const link = info[0].url;
        const title = info[0].title;
        const channelName = info[0].channel.name;
        const songDuration = info[0].durationInSec;
        const thumbnail = info[0].thumbnails[0].url;
        const stream = await this.getStream(link)
        const live = info[0].live
        return [link, title, channelName, songDuration, thumbnail, stream, live];
    }

    /**
     * Method converts raw seconds into min:seconds
     * 
     * @param {Integer} seconds Duration of a video
     * @returns Formatted of mm:ss
     */
    secToMinSec(input) {
        const toMin = input/60;
        const min = Math.floor(toMin);
        const seconds = Math.floor((toMin-min)*60);
        if (seconds < 10) return `${min}:0${seconds}`;
        else return `${min}:${seconds}`;
    }
    
    /**
     * Method accquires video information using play-dl
     * 
     * @param {String} input Search keyword or URL
     * @returns Array of data
     */
    async ___getInfo(input){
        let yt_info = await play.search(input, {
            limit: 1
        })
        return yt_info;
    }

    /**
     * Method checks if the argument is a url or not
     * 
     * @param {String} argument Video title, or URL
     * @returns boolean
     */
    isURL(argument) {
        // return this.ytdl.validateURL(argument);
        return argument.includes("https://www.youtube.com/watch?v=") || argument.includes("https://youtu.be");
    }

    /**
     * Using YTDL, returns something that is playable by discord.js/voice AudioPlayer
     * 
     * @param {String} x A title or a URL
     * @returns AudioResource provided by YTDL
     */
    async getStream(url) {
        const { createAudioResource } = require("@discordjs/voice");
        const source = await play.stream(url);
        const resource = createAudioResource(source.stream, {
            inputType : source.type
        }) 
        return resource;
    }

    /**
     * Method gets the duration of the queue
     * 
     * @param {Queue} queue Queue that contains song links
     * @returns Duration of queue formatted in mm:ss
     */
    getQueueDuration(queue) {
        let array = queue.getArray();
        array.push(queue.getRecentPopped());
        let output = 0;
        // Store everything in one go?
        for (let i = 0; i < array.length; i++) {
            output += Number(array[i][3]);
        }
        return this.secToMinSec(output);
    }
}

module.exports = YouTube;