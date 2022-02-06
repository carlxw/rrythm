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
        const embed = queueEmbed(message, musicPlayer);
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

const queueEmbed = (message, musicPlayer) => {
    const yt = new YouTube();

    const { MessageEmbed } = require("discord.js");
    const userAvatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=100`
    const description = generateQueueList(musicPlayer.getQueue(), message);
    const output = new MessageEmbed()
        .setColor("#874766")
        .setTitle(`**Queue for ${message.guild.name}**`) // Queue for server name
        .setURL("https://discord.js.org/")
        .setDescription(description) // Large string - now playing, up next, songs in queue, total length
        .setFooter({ text: "Page 1/1 | Loop: ❌ | Queue Loop: ❌", iconURL: userAvatar });
    return output;
}

const generateQueueList = (queue, message) => {
    // REFORMAT MESSAGE AUTHOR USERNAME
    console.log(message.author);
    const yt = new YouTube();
    let output = "";
    output += "__Now Playing:__\n";
    output += "[" + queue.getRecentPopped()[1] + "](" + queue.getRecentPopped()[0] + ") | `" + yt.secToMinSec(queue.getRecentPopped()[3]) + " Requested by: " + message.author.username + "`\n";
    output += "\n";
    output += "__Up Next:__\n";
    const array = queue.getArray();
    for (let i = 0; i < array.length; i++) {
        output += "`" + (i+1) + ".`  " + "[" + array[i][1] + "](" + array[i][0] + ") | `" + yt.secToMinSec(array[i][3]) + " Requested by: " + message.author.username + "`\n\n";
    }
    output += "\n";
    output += `**${queue.length()} songs in queue | ${yt.getQueueDuration(queue)} total length**`
    return String(output);
}

module.exports = {
    musicPlayer,
    autodc
}