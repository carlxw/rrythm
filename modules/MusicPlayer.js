const DiscordVoice = require("@discordjs/voice");
const Discord = require("./Discord.js");
const Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");

const yt = new YouTube();
const discord = new Discord();

class MusicPlayer {
    create(message) {
        this.player = DiscordVoice.createAudioPlayer();
        this.queue = new Queue();
        this.message = message;
        this.voiceChannel = message.member.voice.channel;
        this.textChannel = message.channel.name;
        this.loop = false;
        this.#createConnection(message)

        // When the player is in idle mode
        this.player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
            if (this.loop) this.#playAudio();
            if (this.queue.isEmpty()) this.#startTimer();
            else this.#playAudio();
        });

        // When the bot has been forcefully disconnected
        const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');
        this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5000),
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
    #startTimer() {
        this.timer = setTimeout(() => { this.destroy() }, 2*60000);
        console.log("Disconnect timer started");
    }

    destroy() {
        console.log("Disconnected")
        if (this.player) this.player.stop();
        this.player = null;
        this.queue = null;
        this.voiceChannel = null;
        this.textChannel = null;
        this.loop = null;
        if (this.connection) this.connection.destroy();
        this.connection = null;
    }

    /**
     * Creates a voice channel connection
     *
     * @param {String (ID)} message User that called bot
     * @returns connection to the voice channel
     */
    #createConnection(message) {  
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
        if (this.timer) {
            console.log("Disconnect timer cleared");
            clearTimeout(this.timer);
        }
        const element = await yt.acquire(argument);
        element.requestedBy = discord.getUser(message);
        this.queue.add(element, false);
        if (this.getPlayerStatus() === "idle") this.#playAudio();
    }

    /**
     * Enqueues a playlist
     * @param {Discord Message} message message that triggered command
     * @param {String} link Link of playlist
     * @return {String} title of playlist
     */
    async enqueuePlaylist(message, link) {
        const YouTubeStream = require("../modules/YouTubeStream.js");

        const playlist = await yt.acquirePlaylist(link);
        const playlist_videos = await yt.playlist_videos(playlist);

        for (let i = 0; i < playlist_videos.length; i++) {
            let video = new YouTubeStream();
    
            video.link = playlist_videos[i].url;
            video.title = playlist_videos[i].title;
            video.channel = playlist_videos[i].channel.name;
            video.duration = playlist_videos[i].durationInSec;
            video.thumbnail = playlist_videos[i].thumbnails[3].url;
            video.stream = null;
            video.isLive = false; // Playlist entries can't be livestreams
            video.requestedBy = discord.getUser(message);

            this.queue.add(video, false);
        }
        if (this.getPlayerStatus() === "idle") this.#playAudio();
        return playlist;
    }

    /**
     * Method queues song to bot to the top of the queue
     * 
     * @param {String} argument A URL or a keyword
     */
    async enqueueTop(message, argument) {
        const element = await yt.acquire(argument);
        element.requestedBy = discord.getUser(message);
        this.queue.add(element, true);
    }

    /**
     * Plays audio, private method
     */
    async #playAudio() {
        // Self-destruct if bot is alone in a voice call
        if (!this.message.member.voice.channel) {
            this.destroy();
            this.message.channel.send({embeds: [discord.embedText("**Successfully disconnected** 📭")]});
            return;
        }
        
        if (this.loop) {
            const loopedResource = await yt.getStream(this.queue.recentPopped.link); 
            this.player.play(loopedResource);
        }
        // For skip command
        else if (this.queue.isEmpty()) {
            this.player.stop();
            this.#startTimer();
        }
        else {
            const stream = await yt.getStream(this.queue.pop().link)
            this.queue.recentPopped.stream = stream;
            this.player.play(stream);
        }
    }

    /**
     * Skips to next song in queue
     */
    async skip() {
        this.#playAudio();
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