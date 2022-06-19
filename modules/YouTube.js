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
     * @returns Many things...
     */
    async acquire(argument) {
        const YouTubeStream = require("./YouTubeStream.js");
        
        argument = argument.trim();
        let info = await this.getInfo(argument);

        let link;
        if (await play.yt_validate(argument) === "video") link = argument;
        else link = info[0].url;

        const title = info[0].title;
        const channelName = info[0].channel.name;
        const songDuration = info[0].durationInSec;
        const thumbnail = info[0].thumbnails[0].url;
        const stream = await this.getStream(link)
        const live = info[0].live
        return new YouTubeStream(link, title, channelName, songDuration, thumbnail, stream, live);
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
    async getInfo(input){
        let yt_info = await play.search(input, {
            limit: 1
        })
        return yt_info;
    }

    /**
     * Using YTDL, returns something that is playable by discord.js/voice AudioPlayer
     * 
     * @param {String} url A URL
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
     * @returns Duration of queue in seconds
     */
    getQueueDuration(queue) {
        let array = queue.getArray();
        array.push(queue.recentPopped); // Include what is currently playing
        let output = 0;
        // Store everything in one go?
        for (let i = 0; i < array.length; i++) {
            output += Number(array[i].duration);
        }
        return output;
    }
}

module.exports = YouTube;