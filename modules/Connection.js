const { joinVoiceChannel } = require("@discordjs/voice");

class Connection {
    constructor() {
        this.connection;
        this.musicPlayer;
    }

    /**
     * Creates a voice channel connection
     *
     * @param {String (ID)} message User that called bot
     * @returns connection to the voice channel
     */
    createConnection(message) {  
        this.connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        this.startTimer();
    }

    /**
     * Destroys the connection, in addition destroys musicPlayer if exists
     */
    destroyConnection() {
        this.connection.destroy();
        this.connection = null;
        if (this.musicPlayer) this.musicPlayer = null;
    }

    /**
     * Return the Discord connection data
     * 
     * @returns Discord voice channel connection
     */
    getConnection() {
        return this.connection;
    }

    setMusicPlayer(x) {
        this.musicPlayer = x;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    getMusicPlayer() {
        return this.musicPlayer;
    }

    destroyPlayer() {
        this.musicPlayer = null;
        this.startTimer();
    }

    // Auto disconnect that activates when there is no musicPlayer - destroy timer if music player exists
    startTimer() {
        this.timer = setTimeout(() => this.destroyConnection(), 60_000);
    }
}

module.exports = Connection;