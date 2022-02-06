const Discord = require("@discordjs/voice");
let Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");

class MusicPlayer {
    constructor(message) {
        this.message = message;
        this.connection = this.___createConnection(message);
        this.player = Discord.createAudioPlayer();
        this.connection.subscribe(this.player);
        this.queue = new Queue();
        this.interval = setTimeout(() => this.___autoDisconnect(), 60_000);
        this.player.on(Discord.AudioPlayerStatus.Idle, () => {
            if (!this.queue.isEmpty()) this.___playAudio();
            // else setTimeout(() => this.___autoDisconnect(), 60_000);
            else this.___autoDisconnect();
        });
    }

    /**
     * Garbage collect self
     */
    ___autoDisconnect() {
        this.disconnect();
        const {autodc} = require("../index.js");
        autodc();
    }

    /**
     * Creates a voice channel connection
     * 
     * @param {String (ID)} message User that called bot
     * @returns connection to the voice channel
     */
    ___createConnection(message) {
        const output = Discord.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        return output;
    }

    /**
     * Method queues song to bot
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueue(argument) {
        const yt = new YouTube();

        // Clear auto-disconnect timer
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        let link;
        let title;
        let channelName;
        let songDuration;
        let thumbnail;
        let stream
        let requestedBy;
        
        [
            link, 
            title, 
            channelName, 
            songDuration, 
            thumbnail, 
            stream
        ] = await yt.acquire(argument);

        this.queue.add([
            link, 
            title, 
            channelName, 
            songDuration, 
            thumbnail, 
            stream, 
            requestedBy
        ]);
        if (this.getPlayerStatus() === "idle") this.___playAudio();
    }

    /**
     * Plays audio, private method
     */
    async ___playAudio() {
        if (this.queue.isEmpty()) this.___autoDisconnect();
        else this.player.play(Discord.createAudioResource(this.queue.pop()[5]));
    }

    /**
     * Pauses the player
     * 
     * @returns boolean
     */
    pause() {
        if (this.getPlayerStatus() === "playing") {
            this.player.pause();
            return true;
        } else return false;
    }

    /**
     * Unpauses the bot
     * 
     * @returns boolean
     */
    unpause() {
        if (this.getPlayerStatus() === "paused") {
            this.player.unpause();
            return true;
        } else return false;
    }

    /**
     * Destroys the connection, resets the queue
     */
    disconnect() {
        this.connection.destroy();
        this.player.stop();
        this.queue = new Queue();
    }

    /**
     * Creates embed for new queue entry
     * 
     * @returns Embed message
     */
    createEmbed = async () => {
        const { MessageEmbed } = require("discord.js");
        const yt = new YouTube();
        const url = "https://bit.ly/335tabK";

        const title = this.queue.look()[1];
        const channelName = this.queue.look()[2];
        const songDuration = yt.secToMinSec(this.queue.look()[3]);
        const thumbnail = this.queue.look()[4];
        const positionInQueue = this.queue.length();
        const queueDuration = yt.getQueueDuration(this.queue);

        const output = new MessageEmbed()
            .setColor("#000000") 
            .setTitle(title) // Get Song title
            .setURL(this.queue.look()[0]) // Get song thumbnail
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

    isConnected() {
        return connection ? true : false;
    }

    // @returns playing, idle, paused, unpaused
    getPlayerStatus() {
        return this.player.state.status;
    }

    getQueue() {
        return this.queue;
    }
}

module.exports = MusicPlayer;