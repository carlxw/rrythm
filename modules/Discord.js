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
     * Method creates embed that shows the new song added to queue
     *
     * @param message
     * @returns embed
     */
    embedAddedToQueue(message) {
        const { connection } = require("../index.js");
        const queue = connection.getMusicPlayer().getQueue();
        const yt = new YouTube();

        let songDuration
        if (queue.getRecentPopped().isLive) songDuration = "LIVE";
        else songDuration = yt.secToMinSec(queue.getRecentPopped().duration);
        
        let queueDuration = yt.getQueueDuration(queue) - Math.floor(queue.getRecentPopped().duration.playbackDuration/1000, 1) - queue.getRecentPopped()[3];
        if (queueDuration <= 0 ) queueDuration = "Now";
        else queueDuration = yt.secToMinSec(queueDuration);

        const output = new MessageEmbed()
            .setColor("#000000")
            .setTitle(queue.getRecentPopped().title) // Get song title
            .setURL(queue.getRecentPopped().link) // Get song link
            .setAuthor({ name: "Added to queue", iconURL: this.getUserAvatar(message)})
            .setThumbnail(queue.getRecentPopped().thumbnail) // Get song thumbnail
            .addFields(
                { name: "Channel", value: queue.getRecentPopped().channelName, inline: true },
                { name: "Song Duration", value: songDuration, inline: true },
                { name: "Estimated time until playing", value: queueDuration, inline: true },
            )
            .addField("Position in queue", `${queue.search(queue.getRecentAdded().title)}`, true) // Position in queue
        return output;
    }

    /**
     * Gets the embed of the queue
     *
     * @param {Object} message Command triggering message
     * @returns Embed
     */
    embedQueue(message) {
        const { connection } = require("../index.js");
        const musicPlayer = connection.getMusicPlayer();

        const userAvatar = this.getUserAvatar(message);
        const description = this.generateQueueList(musicPlayer.getQueue());
        
        let footerText;
        if (musicPlayer.isLooped()) footerText = "Page 1/1 | Loop: ✅ | Queue Loop: ❌";
        else footerText = "Page 1/1 | Loop: ❌ | Queue Loop: ❌";

        const output = new MessageEmbed()
            .setColor("#874766")
            .setTitle(`**Queue for ${message.guild.name}**`) // Queue for server name
            .setURL("https://discord.js.org/")
            .setDescription(description) // Large string - now playing, up next, songs in queue, total length
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
        if (queue.getRecentPopped().isLive) output += "[" + queue.getRecentPopped().title + "](" + queue.getRecentPopped().link + ") | `" + "LIVE" + " Requested by: " + queue.getRecentPopped().requestedBy + "`\n\n";
        else output += "[" + queue.getRecentPopped().title + "](" + queue.getRecentPopped().link + ") | `" + yt.secToMinSec(queue.getRecentPopped().duration) + " Requested by: " + queue.getRecentPopped().requestedBy + "`\n\n";

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
        const { connection } = require("../index.js");
        const musicPlayer = connection.getMusicPlayer();
        const yt = new YouTube();

        const description = this.generateNPDescription(musicPlayer.getQueue())
        const thumbnail = musicPlayer.getQueue().getRecentPopped()[4];

        const output = new MessageEmbed()
            .setColor("#0056bf")
            .setAuthor({ name: "Now Playing ♪", iconURL: "https://i.imgur.com/dGzFmnr.png", url: "https://discord.js.org" })
            .setDescription(description) // Large string - now playing, up next, songs in queue, total length
            .setThumbnail(thumbnail) // Get song thumbnail
        return output;
    }

    /**
     * Generate the contents for the now playing embed
     * @param {Queue} queue 
     * @returns Contents for the now playing embed
     */
    generateNPDescription(queue) {
        const yt = new YouTube();

        // Current time in seconds
        const currentTime = Math.floor(queue.getRecentPopped().stream.playbackDuration/1000, 1);
        // Total time in seconds
        const totalTime = queue.getRecentPopped().stream;

        let output = "";

        // Name of song
        output += "[" + queue.getRecentPopped().title + "](" + queue.getRecentPopped().link + ")";
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
        output += "`Requested by:` " + queue.getRecentPopped().requestedBy;
        return output;
    }
}

module.exports = Discord;