// See queue
// Edit queue (remove)
// Commands while playing glitches playing (worker threads)

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
const YouTube = require("./modules/YouTube.js");
const skip = require("./commands/skip.js");
const play = require("./commands/play.js");
const disconnect = require("./commands/disconnect.js");
const pause = require("./commands/pause.js");
const join = require("./commands/join.js");

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
    if (command === "play" || command === "p") {
        musicPlayer = await play(musicPlayer, message, args);
    }

    // Skip
    if ((command === "skip" || command === "s") && musicPlayer) {
        skip(musicPlayer, message);
    }

    // Disconnect
    if (command === "disconnect" || command === "dc") {
        musicPlayer = disconnect(musicPlayer, message);
    }

    // Pause
    if (command === "pause" && musicPlayer) {
        pause(musicPlayer, message);
    }

    // Join
    if (command === "join") {
        musicPlayer = join(musicPlayer);
    }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        destroy(musicPlayer);
    }

    if (command === "test") {
        console.log(message.guild.name) // Guild or server name
        console.log(message.author.username+ "#"+message.author.discriminator) // Member name
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