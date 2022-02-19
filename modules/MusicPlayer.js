const DiscordVoice = require("@discordjs/voice");
let Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");

class MusicPlayer {
    constructor(message, connection) {
        this.message = message;
        this.player = DiscordVoice.createAudioPlayer();
        this.connection = connection;
        this.connection.subscribe(this.player);
        this.queue = new Queue();
        this.voiceChannel = message.member.voice.channel.name;
        this.textChannel = message.channelId;
        this.loop = false;
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            if (this.loop || !this.queue.isEmpty()) this.___playAudio();
            else this.___destroySelf()
        });
    }

    /**
     * Garbage collect self
     */
    ___destroySelf() {
        this.player.stop();
        const { connection } = require("../index.js");
        connection.destroyPlayer();
    }

    /**
     * Method queues song to bot
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueue(argument) {
        const yt = new YouTube();

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
        if (this.loop) {
            const yt = new YouTube();
            const loopedResource = await yt.getStream(this.queue.getRecentPopped()[0])
            this.player.play(loopedResource);
        }
        else if (this.queue.isEmpty()) this.___destroySelf();
        else this.player.play(this.queue.pop()[5])
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

    getQueue() {
        return this.queue;
    }

    getSetVChannel() {
        return this.voiceChannel;
    }

    getSetTChannel() {
        return this.textChannel;
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