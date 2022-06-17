const DiscordVoice = require("@discordjs/voice");
const Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");

class MusicPlayer {
    constructor(message) {
        this.player = DiscordVoice.createAudioPlayer();
        this.queue = new Queue();
        this.voiceChannel = message.member.voice.channel.name;
        this.textChannel = message.channelId;
        this.loop = false;
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            if (this.loop || !this.queue.isEmpty()) this.playAudio();
            else this.destroySelf()
        });
    }

    /**
     * Method queues song to bot
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueue(argument) {
        const yt = new YouTube();
        this.queue.add(await yt.acquire(argument), false);
        if (this.getPlayerStatus() === "idle") this.playAudio();
    }

    /**
     * Method queues song to bot to the top of the queue
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueueTop(argument) {
        const yt = new YouTube();
        this.queue.add(await yt.acquire(argument), true);
    }

    /**
     * Plays audio, private method
     */
    async playAudio() {
        if (this.loop) {
            const yt = new YouTube();
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