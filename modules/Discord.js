const YouTube = require("./YouTube.js");
const { MessageEmbed } = require("discord.js");
const Queue = require("./Queue.js");
const MusicPlayer = require("./MusicPlayer.js");

class Discord {

    /**
     * Method gets the message author's name
     *
     * @returns Format: NAME#DISCRIMINATOR
     */
    getUser(message) {
        return message.author.username+"#"+message.author.discriminator;
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
    async embedAddedToQueue(message) {
        const { connection } = require("../index.js");
        const queue = connection.getMusicPlayer().getQueue();

        const yt = new YouTube();
        const url = this.getUserAvatar(message);

        const title = queue.look()[1];
        const channelName = queue.look()[2];

        let songDuration
        if (queue.look()[6]) songDuration = "LIVE";
        else songDuration = yt.secToMinSec(queue.look()[3]);

        const thumbnail = queue.look()[4];
        const positionInQueue = queue.length();
        let queueDuration = yt.getQueueDuration(queue);
        if (queueDuration === "0:00") queueDuration = "Now";

        const output = new MessageEmbed()
            .setColor("#000000")
            .setTitle(title) // Get Song title
            .setURL(queue.look()[0]) // Get song thumbnail
            .setAuthor({ name: "Added to queue", iconURL: url })
            .setThumbnail(thumbnail) // Get song thumbnail
            .addFields(
                { name: "Channel", value: channelName, inline: true },
                { name: "Song Duration", value: songDuration, inline: true },
                { name: "Estimated time until playing", value: queueDuration, inline: true },
            )
            .addField("Position in queue", `${positionInQueue}`, true) // Position in queue
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
        const description = this.___generateQueueList(musicPlayer.getQueue());
        
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
    ___generateQueueList(queue) {       
        const yt = new YouTube();
        let output = "";
        const array = queue.getArray();

        // Now playing - Video title -> Video link -> Video Duration -> Requested by
        output += "__Now Playing:__\n";
        if (queue.getRecentPopped()[6]) output += "[" + queue.getRecentPopped()[1] + "](" + queue.getRecentPopped()[0] + ") | `" + "LIVE" + " Requested by: " + queue.getRecentPopped()[7] + "`\n\n";
        else output += "[" + queue.getRecentPopped()[1] + "](" + queue.getRecentPopped()[0] + ") | `" + yt.secToMinSec(queue.getRecentPopped()[3]) + " Requested by: " + queue.getRecentPopped()[7] + "`\n\n";

        // Up next - Video title -> Video link -> Video Duration -> Requested by
        output += "__Up Next:__\n";
        for (let i = 0; i < array.length; i++) {
            if (array[i][6]) output += "`" + (i+1) + ".`  " + "[" + array[i][1] + "](" + array[i][0] + ") | `" + "LIVE" + " Requested by: " + array[i][7] + "`\n\n";
            else output += "`" + (i+1) + ".`  " + "[" + array[i][1] + "](" + array[i][0] + ") | `" + yt.secToMinSec(array[i][3]) + " Requested by: " + array[i][7] + "`\n\n";
        }
        output += "\n";

        // Queue information - # songs in queue | #:## total length
        if (queue.length() === 1) output += `**${queue.length()} song in queue | ${yt.getQueueDuration(queue)} total length**`
        else output += `**${queue.length()} songs in queue | ${yt.getQueueDuration(queue)} total length**`

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

        const description = this.___generateNPDescription(musicPlayer.getQueue())
        const thumbnail = musicPlayer.getQueue().getRecentPopped()[4];

        const output = new MessageEmbed()
            .setColor("#0056bf")
            .setAuthor({ name: "Now Playing ♪", iconURL: "https://i.imgur.com/dGzFmnr.png", url: "https://discord.js.org" })
            .setDescription(description) // Large string - now playing, up next, songs in queue, total length
            .setThumbnail(thumbnail) // Get song thumbnail
        return output;
    }


    ___generateNPDescription(queue) {
        const yt = new YouTube();

        // Current time in seconds
        const currentTime = Math.floor(queue.getRecentPopped()[5].playbackDuration/1000, 1);
        // Total time in seconds
        const totalTime = queue.getRecentPopped()[3];

        let output = "";

        // Name of song
        output += "[" + queue.getRecentPopped()[1] + "](" + queue.getRecentPopped()[0] + ")";
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
        output += "`Requested by:` " + queue.getRecentPopped()[7];
        return output;
    }
}

module.exports = Discord;