const { joinVoiceChannel } = require("@discordjs/voice");
const MusicPlayer = require("./MusicPlayer.js");

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
    }

    /**
     * Destroys the connection, in addition destroys musicPlayer if exists
     */
    destroyConnection() {
        const { musicPlayer } = require("../index.js");
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
    }

    getmusicPlayer() {
        return this.musicPlayer;
    }
}

module.exports = Connection;