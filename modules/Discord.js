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
     * @param {Queue} queue MusicPlayer's queue
     * @returns embed
     */
    async embedAddedToQueue(queue, message) {
        const yt = new YouTube();
        const url = this.getUserAvatar(message);

        const title = queue.look()[1];
        const channelName = queue.look()[2];
        const songDuration = yt.secToMinSec(queue.look()[3]);
        const thumbnail = queue.look()[4];
        const positionInQueue = queue.length();
        const queueDuration = yt.getQueueDuration(queue);

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
     * @param {MusicPlayer} musicPlayer Music player
     * @returns Embed
     */
    embedQueue(musicPlayer, message) {
        const { MessageEmbed } = require("discord.js");
        const userAvatar = this.getUserAvatar(message);
        const description = this.___generateQueueList(musicPlayer.getQueue(), message);
        const output = new MessageEmbed()
            .setColor("#874766")
            .setTitle(`**Queue for ${message.guild.name}**`) // Queue for server name
            .setURL("https://discord.js.org/")
            .setDescription(description) // Large string - now playing, up next, songs in queue, total length
            .setFooter({ text: "Page 1/1 | Loop: ❌ | Queue Loop: ❌", iconURL: userAvatar });
        return output;
    }

    /**
     * Helper method to queueEmbed(message, musicPlayer) - Generates description
     * 
     * @param {Queue} queue The queue the music player has
     * @param {Object} message Message that triggered command
     * @returns Formatted description (String)
     */
    ___generateQueueList (queue, message) {
        const yt = new YouTube();
        let output = "";

        // Now playing
        output += "__Now Playing:__\n";
        output += "[" + queue.getRecentPopped()[1] + "](" + queue.getRecentPopped()[0] + ") | `" + yt.secToMinSec(queue.getRecentPopped()[3]) + " Requested by: " + this.getUser(message) + "`\n\n";

        // Up next
        output += "__Up Next:__\n";
        const array = queue.getArray();
        for (let i = 0; i < array.length; i++) {
            output += "`" + (i+1) + ".`  " + "[" + array[i][1] + "](" + array[i][0] + ") | `" + yt.secToMinSec(array[i][3]) + " Requested by: " + this.getUser(message) + "`\n\n";
        }
        output += "\n";

        // Queue information
        if (queue.length() === 1) output += `**${queue.length()} song in queue | ${yt.getQueueDuration(queue)} total length**`
        else output += `**${queue.length()} songs in queue | ${yt.getQueueDuration(queue)} total length**`

        return String(output);
    }
}

module.exports = Discord;