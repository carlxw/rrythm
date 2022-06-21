const DiscordVoice = require("@discordjs/voice");
const Discord = require("./Discord.js");
const Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");
const yt = new YouTube();

class MusicPlayer {
    create(message) {
        this.player = DiscordVoice.createAudioPlayer();
        this.queue = new Queue();
        this.voiceChannel = message.member.voice.channel.name;
        this.textChannel = message.channel.name;
        this.loop = false;
        this.createConnection(message)

        // When the player is in idle mode
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            if (this.loop) this.playAudio();
            if (this.queue.isEmpty()) this.startTimer();
            else this.playAudio();
        });

        // When the bot has been forcefully disconnected
        const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');
        this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                console.log("Admin DC'd");
                this.destroy();
            }
        });
    }

    // Auto disconnect that activates when there is nothing in queue
    startTimer() {
        this.timer = setTimeout(() => this.destroy(), 120_000);
    }

    destroy() {
        this.player.stop();
        this.player = null;
        this.queue = null;
        this.voiceChannel = null;
        this.textChannel = null;
        this.loop = null;
        this.connection.destroy();
        this.connection = null;
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
     * Method queues song to bot
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueue(message, argument) {
        const discord = new Discord();
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        const element = await yt.acquire(argument);
        element.requestedBy = discord.getUser(message);
        this.queue.add(element, false);
        if (this.getPlayerStatus() === "idle") this.playAudio();
    }

    /**
     * Enqueues a playlist
     * @param {Discord Message} message message that triggered command
     * @param {String} link Link of playlist
     * @return {String} title of playlist
     */
    async enqueuePlaylist(message, link) {
        const YouTubeStream = require("../modules/YouTubeStream.js");
        const discord = new Discord();

        const playlist = await yt.acquirePlaylist(link);

        for (let i = 0; i < playlist.videos.length; i++) {
            let video = new YouTubeStream();
    
            video.link = playlist.videos[i].url;
            video.title = playlist.videos[i].title;
            video.channel = playlist.videos[i].channel.name;
            video.duration = playlist.videos[i].durationInSec;
            video.thumbnail = playlist.videos[i].thumbnails[3].url;
            video.stream = null;
            video.isLive = false; // Playlist entries can't be livestreams
            video.requestedBy = discord.getUser(message);

            this.queue.add(video, false);
        }
        if (this.getPlayerStatus() === "idle") this.playAudio();
        return playlist;
    }

    /**
     * Method queues song to bot to the top of the queue
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueueTop(message, argument) {
        const discord = new Discord();
        const element = await yt.acquire(argument);
        element.requestedBy = discord.getUser(message);
        this.queue.add(element, true);
    }

    /**
     * Plays audio, private method
     */
    async playAudio() {
        // Part of a playlist
        if (this.queue.peek().stream === null) {
            this.queue.peek().stream = await yt.getStream(this.queue.peek().link);
        }

        if (this.loop) {
            const loopedResource = await yt.getStream(this.queue.recentPopped.link)
            this.player.play(loopedResource);
        }
        // For skip command
        else if (this.queue.isEmpty()) {
            this.player.stop();
            this.startTimer();
        }
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

    // @returns playing, idle, paused, unpaused
    getPlayerStatus() {
        return this.player.state.status;
    }

    toggleLoop() {
        if (this.loop) this.loop = false;
        else this.loop = true;
    }
}

module.exports = MusicPlayer;