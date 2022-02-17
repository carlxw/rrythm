const DiscordVoice = require("@discordjs/voice");
let Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");
const connection = require("../index.js");

class MusicPlayer {
    constructor(message) {
        this.message = message;
        this.player = DiscordVoice.createAudioPlayer();
        connection.subscribe(this.player);
        this.queue = new Queue();
        this.interval = setTimeout(() => this.___autoDisconnect(), 60_000);
        this.voiceChannel = message.member.voice.channel.name;
        this.textChannel = message.channelId;
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
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
        else {
            this.player.play(this.queue.pop()[5]);
        }
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
}

module.exports = MusicPlayer;