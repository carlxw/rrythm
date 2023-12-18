const YouTube = require("./YouTube.js");
const { EmbedBuilder } = require("discord.js");

const yt = new YouTube();

class Discord {
    /**
     * Method converts raw seconds into min:seconds
     * 
     * @param {Integer} seconds Duration of a video
     * @returns Formatted of mm:ss
    */ 
    #secToMinSec(input) {
        const toMin = input / 60;
        const min = Math.floor(toMin);
        const seconds = Math.floor((toMin - min) * 60);
        if (seconds < 10) return `${min}:0${seconds}`;
        else return `${min}:${seconds}`;
    }

    /**
     * Method gets the duration of the queue
     * 
     * @param {Queue} queue Queue that contains song links
     * @returns Duration of queue in seconds
     */
    #getQueueDuration(queue) {
        let array = queue.getArray();
        array.push(queue.recentPopped); // Include what is currently playing
        let output = 0;
        // Store everything in one go?
        for (let i = 0; i < array.length; i++) {
            output += Number(array[i].duration);
        }
        return output;
    }

    /**
     * Method gets the message author's name
     *
     * @returns Format: NAME#DISCRIMINATOR
     */
    getUser(message) {
        return message.author.username + "#" + message.author.discriminator;
    }

    /**
     * Gets the user's avatar
     *
     * @param {Object} message Message that activated command
     * @returns URL to the user's avatar
     */
    getUserAvatar(message) {
        return `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=100`
    }

    /**
     * Generates an embed based on text. Cannot apply text font formatting.
     * @param {String} text The message to output
     * @returns Discord embed to send
     */
    embedText(text) {
        const output = new EmbedBuilder()
            .setColor('#FF3741')
            .setDescription(text)
            .setTimestamp()
            .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
        return output;
    }

    /**
     * Embed for first time playing ONLY
     * 
     * @param {Discordjs} message Message that triggered command
     */
    embedPlay(message) {
        const { musicPlayer } = require("../index.js");
        const queue = musicPlayer.queue;

        let songDuration
        if (queue.recentAdded.isLive) songDuration = "LIVE";
        else songDuration = this.#secToMinSec(queue.recentAdded.duration);

        const output = new EmbedBuilder()
            .setColor("#FF3741")
            .setTitle(queue.recentAdded.title) // Get song title
            .setURL(queue.recentAdded.link) // Get song link
            .setAuthor({ name: "Playing 🎶" })
            .setThumbnail(queue.recentAdded.thumbnail) // Get song thumbnail
            .addFields(
                { name: "Channel", value: queue.recentAdded.channel, inline: true },
                { name: "Song Duration", value: songDuration, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
        return output;
    }

    /**
     * Method creates embed that shows the new song added to queue
     *
     * @param message
     * @returns embed
     */
    async embedAddedToQueue(message) {
        const { musicPlayer } = require("../index.js");
        const queue = musicPlayer.queue;

        let songDuration
        if (queue.recentAdded.isLive) songDuration = "LIVE";
        else songDuration = this.#secToMinSec(queue.recentAdded.duration);
        
        let queueDuration = this.#getQueueDuration(queue) - Math.floor((queue.recentPopped.stream.playbackDuration)/1000, 1) - queue.recentAdded.duration;
        if (queueDuration <= 0 ) queueDuration = "Now";
        else queueDuration = this.#secToMinSec(queueDuration);

        const output = new EmbedBuilder()
            .setColor("#FF3741")
            .setTitle(queue.recentAdded.title) // Get song title
            .setURL(queue.recentAdded.link) // Get song link
            .setAuthor({ name: "Added to queue", iconURL: this.getUserAvatar(message)})
            .setThumbnail(queue.recentAdded.thumbnail) // Get song thumbnail
            .addFields(
                { name: "Channel", value: queue.recentAdded.channel, inline: true },
                { name: "Song Duration", value: songDuration, inline: true },
                { name: "Estimated time until playing", value: queueDuration, inline: true },
                { name: "Position in queue", value: `${queue.search(queue.recentAdded.title)}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
        return output;
    }

    /**
     * Creates embed for playlist entries
     * @param {Play-dl Playlist} playlist 
     * @returns Embed to send
     */
    embedPlaylist(message, playlist) {
        const userAvatar = this.getUserAvatar(message);

        const videoArrLen = yt.playlist_videos(playlist).length;

        const output = new EmbedBuilder()
            .setColor('#FF3741')
            .setTitle(playlist.title)
            .setAuthor({ name: "Playlist added to queue", iconURL: userAvatar })
            .setDescription("**Enqueued** `"+ videoArrLen +"` **songs**")
            .setTimestamp()
            .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
        return output;
    }

    /**
     * Gets the embed of the queue
     *
     * @param {Object} message Command triggering message
     * @param {Number} page Command triggering message
     * @returns Embed
     */
    embedQueue(message, page = 1) {
        const { musicPlayer } = require("../index.js");

        // const userAvatar = this.getUserAvatar(message);
        const userAvatar = "https://i.imgur.com/dGzFmnr.png";
        const description = this.generateQueueList(musicPlayer.queue, page);
        
        let footerText;
        if (musicPlayer.loop) footerText = `Page ${page} | Loop: ✅ | Queue Loop: ❌`;
        else footerText = `Page ${page} | Loop: ❌ | Queue Loop: ❌`;

        const output = new EmbedBuilder()
            .setColor('#FF3741')
            .setTitle(`**Queue for ${message.guild.name}**`) // Queue for server name
            .setURL("https://discord.js.org/")
            .setDescription(description) // Large string - now playing, up next, songs in queue, total length
            .setTimestamp()
            .setFooter({ text: footerText, iconURL: userAvatar });
        return output;
    }

    /**
     * Helper method to queueEmbed(message) - Generates description
     *
     * @returns Formatted description (String)
     */
    generateQueueList(queue, page) {       
        let output = "";
        const array = queue.getArray();

        // Include on top of page
        if (page === 1) {
            // Now playing - Video title -> Video link -> Video Duration -> Requested by
            output += "__Now Playing:__\n";
            if (queue.recentPopped.isLive) output += "[" + queue.recentPopped.title + "](" + queue.recentPopped.link + ") | `" + "LIVE" + " Requested by: " + queue.recentPopped.requestedBy + "`\n\n";
            else output += "[" + queue.recentPopped.title + "](" + queue.recentPopped.link + ") | `" + this.#secToMinSec(queue.recentPopped.duration) + " Requested by: " + queue.recentPopped.requestedBy + "`\n\n";
            output += "__Up Next:__\n";
        }

        // Up next - Video title -> Video link -> Video Duration -> Requested by
        for (let i = (20*(page-1)); i < (20*page); i++) {
            if (i > array.length-1) break;

            if (array[i].isLive) output += "`" + (i+1) + ".`  " + "[" + array[i].title + "](" + array[i].link + ") | `" + "LIVE" + " Requested by: " + array[i].requestedBy + "`\n\n";
            else output += "`" + (i+1) + ".`  " + "[" + array[i].title + "](" + array[i].link + ") | `" + this.#secToMinSec(array[i].duration) + " Requested by: " + array[i].requestedBy + "`\n\n";
        }
        output += "\n";

        // Queue information - # songs in queue | #:## total length
        if (queue.length() === 1) output += `**${queue.length()} song in queue | ${this.#secToMinSec(this.#getQueueDuration(queue))} total length**`
        else output += `**${queue.length()} songs in queue | ${this.#secToMinSec(this.#getQueueDuration(queue))} total length**`

        return String(output);
    }

    /**
     * Gets the embed of the queue
     *
     * @param {Object} message Command triggering message
     * @returns Embed
     */
    embedNowPlaying() {
        const { musicPlayer } = require("../index.js");

        const output = new EmbedBuilder()
            .setColor('#FF3741')
            .setAuthor({ name: "Now Playing ♪", iconURL: "https://i.imgur.com/dGzFmnr.png", url: "https://discord.js.org" })
            .setDescription(this.generateNPDescription(musicPlayer.queue.recentPopped)) // Large string - now playing, up next, songs in queue, total length
            .setThumbnail(musicPlayer.queue.recentPopped.thumbnail); // Get song thumbnail
        return output;
    }

    /**
     * Generate the contents for the now playing embed
     * @param {Queue} element Element in queue 
     * @returns Contents for the now playing embed
     */
    generateNPDescription(element) {
        // Current time in seconds
        const currentTime = Math.floor(element.stream.playbackDuration/1000, 1);
        // Total time in seconds
        const totalTime = element.duration;

        let output = "";

        // Name of song
        output += "[" + element.title + "](" + element.link + ")";
        output += "\n\n";

        // Progress bar
        output += "`";
        for (let i = 0; i < 30; i++) {
            if (i === Math.floor((currentTime / totalTime)*30, 1)) output += "🔘";
            else output += "▬";
        }
        output += "`\n\n";

        // Time
        output += "`" + this.#secToMinSec(currentTime) + " / " + this.#secToMinSec(totalTime) + "`";
        output += "\n\n";

        // Requested by
        output += "`Requested by:` " + element.requestedBy;
        return output;
    }
}

module.exports = Discord;