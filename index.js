// See queue
// Edit queue
// https://discordjs.guide/popular-topics/embeds.html#embed-preview

const { Client, Intents } = require("discord.js");

// Import from config.json
const config = require("./config.json");

// Initialize bot
const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Bot active
client.on("ready", () => {
    console.log("Rrythm is active!");
});

// Activate bot
client.login(config.token);

// Imports
const destroy = require("./commands/destroy.js");
const MusicPlayer = require("./modules/Musicplayer.js");
const YouTube = require("./modules/YouTube.js");

// Initalize
let musicPlayer;
const yt = new YouTube();

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix, ignore users not in voice channel
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
    else if (!message.member.voice.channel) {
        message.channel.send("❌ **You have to be in a voice channel to use this command.**");
    }
    // Isolate arguments (array) and command
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    args = format(args);

    // Play, queue, unpause
    let title;
    if (command === "play" || command === "p") {
        if (!args && !musicPlayer) {
            message.channel.send("❌ **There is nothing to play**");
        }
        else if (!args && musicPlayer) {
            musicPlayer.unpause();
            message.channel.send("⏯ **Resuming** 👍");
        } else if (!musicPlayer) { // Not running
            musicPlayer = new MusicPlayer(message);
            message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
            message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
            await musicPlayer.enqueue(args);
            title = await yt.getTitle(args);
            message.channel.send("**Playing** 🎶 `" + title + "` - Now!");
        }
        else if (musicPlayer) { // Add song to queue
            message.channel.send("🎵 **Searching** 🔎 `" + args + "`");
            await musicPlayer.enqueue(args);
            title = await yt.getTitle(args);
            message.channel.send("✅ **Added **`" + title + "`** to queue**");
        }
    }

    if (command === "skip" || command === "s") {
        if (musicPlayer) {
            musicPlayer.___playAudio();
            message.channel.send("⏩ **Skipped** 👍");
        }
    }

    // Disconnect
    if (command === "disconnect" || command === "dc") {
        if (!musicPlayer) {
            message.channel.send("❌ **I am not in a voice channel**");
        } else {
            musicPlayer.disconnect();
            musicPlayer = null;
            message.channel.send("📭 **Successfully disconnected**");
        }
    }

    // Pause
    if (command === "pause" && musicPlayer) {
        musicPlayer.pause();
        message.channel.send("**Paused** ⏸");
    }

    // Join
    if (command === "join") {
        if (!musicPlayer) {
            musicPlayer = new MusicPlayer(message);
            message.channel.send("👍 **Joined** `" + message.member.voice.channel.name + "` **and bound to " + message.channel.toString() + "**"); // Will need to update in future
        }
    }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        await destroy(musicPlayer);
    }
});

// Formats all entries from an array to a single string
const format = (arr) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) {
        output = output + arr[i] + " ";
    }
    return output.trim();
}

// Auto disconnects music bot and garbage collects it
const autodc = () => {
    if (musicPlayer) musicPlayer = null;
}

module.exports = {
    musicPlayer,
    autodc
}