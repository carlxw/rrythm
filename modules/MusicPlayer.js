const DiscordVoice = require("@discordjs/voice");
const Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");
const yt = new YouTube();

class MusicPlayer {
    constructor(message) {
        if (!message) return;
        this.player = DiscordVoice.createAudioPlayer();
        this.queue = new Queue();
        this.voiceChannel = message.member.voice.channel.name;
        this.textChannel = message.channelId;
        this.loop = false;
        this.createConnection(message);
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            this.connection.destroy();
        });
    }

    /**
     * Creates a voice channel connection
     *
     * @param {String (ID)} message User that called bot
     * @returns connection to the voice channel
     */
    createConnection(message) {  
        const { joinVoiceChannel } = require("@discordjs/voice");
        this.connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        this.connection.subscribe(this.player);
    }

    /**
     * Destroys the connection, in addition destroys musicPlayer if exists
     */
    destroyConnection() {
        if (this.connection) this.connection.destroy();
        this.connection = null;
    }

    /**
     * Method queues song to bot
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueue(argument) {
        this.queue.add(await yt.acquire(argument), false);
        if (this.getPlayerStatus() === "idle") this.playAudio();
    }

    /**
     * Method queues song to bot to the top of the queue
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueueTop(argument) {
        this.queue.add(await yt.acquire(argument), true);
    }

    /**
     * Plays audio, private method
     */
    async playAudio() {
        if (this.loop) {
            const loopedResource = await yt.getStream(this.queue.getRecentPopped().link)
            this.player.play(loopedResource);
        }
        else if (this.queue.isEmpty()) this.destroySelf();
        else this.player.play(this.queue.pop().stream)
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

    stop() {
        this.player.stop();
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

    // @returns playing, idle, paused, unpaused
    getPlayerStatus() {
        return this.player.state.status;
    }

    toggleLoop() {
        if (this.loop) this.loop = false;
        else this.loop = true;
    }

    isLooped() {
        return this.loop;
    }
}

module.exports = MusicPlayer;