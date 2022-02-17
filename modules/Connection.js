const { joinVoiceChannel } = require("@discordjs/voice");

class Connection {
    constructor() {
        this.connection
    }

    /**
     * Creates a voice channel connection
     *
     * @param {String (ID)} message User that called bot
     * @returns connection to the voice channel
     */
    createConnection(message) {  
        const output = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        this.connection = output;
    }

    /**
     * Destroys the connection, in addition destroys musicPlayer if exists
     */
    destroyConnection() {
        const { musicPlayer } = require("../index.js");
        this.connection.destroy();
        this.connection = null;
        if (musicPlayer) musicPlayer = null;
    }

    /**
     * Return the Discord connection data
     * 
     * @returns Discord voice channel connection
     */
    getConnection() {
        return this.connection;
    }
}

module.exports = Connection;