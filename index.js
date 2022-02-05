// See queue
// Edit queue
// https://discordjs.guide/popular-topics/embeds.html#embed-preview
// Commands while playing glitches playing
// Refactor so that YouTube is completely outside of music player

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

    const { generateDependencyReport } = require("@discordjs/voice");
    console.log(generateDependencyReport());
});

// Activate bot
client.login(config.token);

// Imports
const destroy = require("./commands/destroy.js");
const MusicPlayer = require("./modules/Musicplayer.js");
const YouTube = require("./modules/YouTube.js");
const { MessageEmbed } = require("discord.js");


// Initalize
let musicPlayer;
const yt = new YouTube();

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix, ignore users not in voice channel
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

    // Isolate arguments (array) and command
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    args = format(args);

    // Play, queue, unpause
    let title;
    if (command === "play" || command === "p") {
        if (!message.member.voice.channel) {
            message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        } else if (!args && !musicPlayer) {
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
            const embed = await createEmbed(musicPlayer, yt);
            message.channel.send({embeds: [embed]});
        }
    }

    // Skip
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
        destroy(musicPlayer);
    }

    if (command === "test") {
        const embed = await createEmbed(musicPlayer, yt);
        message.channel.send({embeds: [embed]});
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

const createEmbed = async (musicPlayer, yt) => {
    const url = "https://bit.ly/335tabK";
    const queue = musicPlayer.getQueue();
    const channelName = await yt.getVideoChannel(queue.look());
    const songDuration = yt.secToMinSec(await yt.getVideoLength(queue.look()));
    const thumbnail = await yt.getThumbnail(queue.look());
    const positionInQueue = queue.length();
    const title = await yt.getTitle(queue.look());
    const output = new MessageEmbed()
        .setColor("#000000") 
        .setTitle(title) // Get Song title
        .setURL(queue.look()) // Get song thumbnail
        .setAuthor({ name: "Added to queue", iconURL: url })
        .setThumbnail(thumbnail) // Get song thumbnail
        .addFields(
            { name: "Channel", value: channelName, inline: true },
            { name: "Song Duration", value: songDuration, inline: true },
            { name: "Estimated time until playing", value: "Who knows lol", inline: true },
        )
        .addField("Position in queue", `${positionInQueue}`, true) // Position in queue
    return output;
}

module.exports = {
    musicPlayer,
    autodc
}