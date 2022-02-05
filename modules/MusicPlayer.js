const Discord = require("@discordjs/voice");
let Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");
const ytdl = require("ytdl-core");

class MusicPlayer {
    constructor(message) {
        this.message = message;
        this.youtube = new YouTube();
        this.connection = this.___createConnection(message);
        this.player = Discord.createAudioPlayer();
        this.connection.subscribe(this.player);
        this.queue = new Queue();
        this.player.on(Discord.AudioPlayerStatus.Idle, () => {
            this.___playAudio();
        });
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
        if (await this.youtube.isURL(argument)) { // Argument is a url
            this.queue.add(argument)
        } else { // Arugment is a title
            this.queue.add(await this.youtube.getURL(argument));
        }
        if (this.getPlayerStatus() === "idle") {
            this.___playAudio();
        }
    }

    /**
     * Plays audio, private method
     */
    async ___playAudio() {
        const stream = await this.youtube.getStream(this.queue.pop())
        this.player.play(Discord.createAudioResource(stream));
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

    isConnected() {
        return connection ? true : false;
    }

    /**
     * Gets the player status
     * 
     * @returns playing, idle, paused, unpaused
     */
    getPlayerStatus() {
        return this.player.state.status;
    }
}

module.exports = MusicPlayer;