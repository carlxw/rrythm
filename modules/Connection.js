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
        if (this.connection) this.connection.destroy();
        if (this.musicPlayer) this.musicPlayer = null;
        this.connection = null;
    }

    setMusicPlayer(player) {
        this.musicPlayer = player;
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    getMusicPlayer() {
        return this.musicPlayer;
    }

    // Auto disconnect that activates when there is no musicPlayer - destroy timer if music player exists
    startTimer() {
        this.timer = setTimeout(() => this.destroyConnection(), 60_000);
    }
}

module.exports = Connection;