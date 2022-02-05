const Discord = require("@discordjs/voice");
let Queue = require("./Queue.js");
const YouTube = require("./YouTube.js");
const ytdl = require("ytdl-core");

class MusicPlayer {
    constructor(message) {
        this.message = message;
        this.youtube = new YouTube();
        this.connection = this.___createConnection(message);
        this.player = Discord.createAudioPlayer();
        this.connection.subscribe(this.player);
        this.queue = new Queue();
        this.player.on(Discord.AudioPlayerStatus.Idle, () => {
            console.log("Switching songs");
        });
    }

    ___createConnection(message) {
        const output = Discord.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        return output;
    }

    async enqueue(argument) {
        if (await this.youtube.isURL(argument)) { // Argument is a url
            this.queue.add(argument)
            console.log("isURL");
        } else { // Arugment is a title
            this.queue.add(await this.youtube.getURL(argument));
            console.log("NotURL");
        }
        this.___playAudio();
    }

    async ___playAudio() {
        console.log("In ___playingAudio()");
        const stream = ytdl("https://www.youtube.com/watch?v=lk0gm_Z81bE", {filter: "audioonly"});
        this.player.play(Discord.createAudioResource(stream));
    }

    pause() {
        if (this.getPlayerStatus() === "playing") {
            this.player.pause();
            return true;
        } else return false;
    }

    unpause() {
        if (this.getPlayerStatus() === "paused") {
            this.player.unpause();
            return true;
        } else return false;
    }

    disconnect() {
        this.connection.destroy();
        this.queue = new Queue();
    }

    isConnected() {
        return connection ? true : false;
    }

    getPlayerStatus() {
        return this.player.state.status;
    }
}

module.exports = MusicPlayer;