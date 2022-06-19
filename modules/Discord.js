const YouTube = require("./YouTube.js");
const { MessageEmbed } = require("discord.js");

class Discord {
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
        const output = new MessageEmbed()
            .setColor("#FF3741")
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
        const yt = new YouTube();

        let songDuration
        if (queue.recentAdded.isLive) songDuration = "LIVE";
        else songDuration = yt.secToMinSec(queue.recentAdded.duration);

        const output = new MessageEmbed()
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
    embedAddedToQueue(message) {
        const { musicPlayer } = require("../index.js");
        const queue = musicPlayer.queue;
        const yt = new YouTube();

        let songDuration
        if (queue.recentAdded.isLive) songDuration = "LIVE";
        else songDuration = yt.secToMinSec(queue.recentAdded.duration);
        
        let queueDuration = yt.getQueueDuration(queue) - Math.floor(queue.recentAdded.stream.playbackDuration/1000, 1) - queue.recentAdded.duration;
        if (queueDuration <= 0 ) queueDuration = "Now";
        else queueDuration = yt.secToMinSec(queueDuration);

        const output = new MessageEmbed()
            .setColor("#FF3741")
            .setTitle(queue.recentAdded.title) // Get song title
            .setURL(queue.recentAdded.link) // Get song link
            .setAuthor({ name: "Added to queue", iconURL: this.getUserAvatar(message)})
            .setThumbnail(queue.recentAdded.thumbnail) // Get song thumbnail
            .addFields(
                { name: "Channel", value: queue.recentAdded.channel, inline: true },
                { name: "Song Duration", value: songDuration, inline: true },
                { name: "Estimated time until playing", value: queueDuration, inline: true },
            )
            .addField("Position in queue", `${queue.search(queue.recentAdded.title)}`, true) // Position in queue
            .setTimestamp()
            .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
        return output;
    }

    /**
     * Gets the embed of the queue
     *
     * @param {Object} message Command triggering message
     * @returns Embed
     */
    embedQueue(message) {
        const { musicPlayer } = require("../index.js");

        const userAvatar = this.getUserAvatar(message);
        const description = this.generateQueueList(musicPlayer.queue);
        
        let footerText;
        if (musicPlayer.loop) footerText = "Page 1/1 | Loop: ✅ | Queue Loop: ❌";
        else footerText = "Page 1/1 | Loop: ❌ | Queue Loop: ❌";

        const output = new MessageEmbed()
            .setColor("#874766")
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
    generateQueueList(queue) {       
        const yt = new YouTube();
        let output = "";
        const array = queue.getArray();

        // Now playing - Video title -> Video link -> Video Duration -> Requested by
        output += "__Now Playing:__\n";
        if (queue.recentPopped.isLive) output += "[" + queue.recentPopped.title + "](" + queue.recentPopped.link + ") | `" + "LIVE" + " Requested by: " + queue.recentPopped.requestedBy + "`\n\n";
        else output += "[" + queue.recentPopped.title + "](" + queue.recentPopped.link + ") | `" + yt.secToMinSec(queue.recentPopped.duration) + " Requested by: " + queue.recentPopped.requestedBy + "`\n\n";

        // Up next - Video title -> Video link -> Video Duration -> Requested by
        output += "__Up Next:__\n";
        for (let i = 0; i < array.length; i++) {
            if (array[i].isLiive) output += "`" + (i+1) + ".`  " + "[" + array[i].title + "](" + array[i].link + ") | `" + "LIVE" + " Requested by: " + array[i].requestedBy + "`\n\n";
            else output += "`" + (i+1) + ".`  " + "[" + array[i].title + "](" + array[i].link + ") | `" + yt.secToMinSec(array[i].duration) + " Requested by: " + array[i].requestedBy + "`\n\n";
        }
        output += "\n";

        // Queue information - # songs in queue | #:## total length
        if (queue.length() === 1) output += `**${queue.length()} song in queue | ${yt.secToMinSec(yt.getQueueDuration(queue))} total length**`
        else output += `**${queue.length()} songs in queue | ${yt.secToMinSec(yt.getQueueDuration(queue))} total length**`

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
        const yt = new YouTube();

        const output = new MessageEmbed()
            .setColor("#0056bf")
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
        const yt = new YouTube();

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
        output += "`" + yt.secToMinSec(currentTime) + " / " + yt.secToMinSec(totalTime) + "`";
        output += "\n\n";

        // Requested by
        output += "`Requested by:` " + element.requestedBy;
        return output;
    }
}

module.exports = Discord;