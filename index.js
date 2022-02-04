const { Client, Intents } = require("discord.js");
const Queue = require("./Queue.js");
const { AudioPlayerStatus, createAudioPlayer } = require("@discordjs/voice");

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

// Import from ./commands/.js
const play = require("./commands/play.js");
const disconnect = require("./commands/disconnect.js");
const destroy = require("./commands/destroy.js");
const pause = require("./commands/pause.js");
const unpause = require("./commands/unpause.js");
const join = require("./commands/join.js");

// Voice player
let connection;
let player;
let queue = new Queue();

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
    // Isolate arguments (array) and command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Play, queue, unpause
    if (command === "play" || command === "p") {
        if (!connection && !player) { // !connection: Create queue, connection, player
            print("No connection, no player");
            [connection, player] = await play(message, args, null, null);
        } else if (!player && connection) { // connection, !queue, !player: Queue something and play it
            print("No player, yes connection");
            player = await play(message, args, connection, player);
        } else if (connection, player) { // connection, player, !queue: Queue something and play it
            print("Queue new song")
            await play(message, args, connection, player);
        } else { // Unpause 
            await unpause(message, player);
        }
    }

    // Disconnect
    if (command === "disconnect" || command === "dc") {
        if (connection && player) { // Connection and player
            [connection, player] = await disconnect(message, connection, player);
        } else if (connection && !player) { // Connection, no player
            connection = await disconnect(message, connection);
        } else {
            message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        }
    }

    // Pause
    if (command === "pause") {
        await pause(message, player, connection);
    }

    // Join
    if (command === "join") {
        if (!connection) { // No connection, just join
            connection = await join(message);
        } else { // There is connection, already in a voice channel
            message.channel.send("❌ **I am already in `" + message.member.voice.channel.name + "`!**");
        }
    }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        await destroy(message);
    }

    if (command === "state") {
        message.channel.send(player.state.status);
    }
});

// Activate bot
client.login(config.token);

function print(x) {
    console.log(x);
}

module.exports = queue;