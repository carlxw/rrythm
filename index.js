const { Client, Intents } = require("discord.js");
const Queue = require("./Queue.js");

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
    console.log("Rythm is active!");
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
let queue = new Queue(); // Queue of songs

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

    // Isolate arguments (array) and command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Play, queue, unpause
    if (command === "play" || command === "p") {
        if (!connection) { // No connection: Create queue, connection, player
            [connection, player, queue] = await play(message, args, queue);
        } else if (!queue && !player) { // There is a connection, there is no queue and player
            [player, queue] = await play(message, args, queue, connection, player);
        } else if (connection, player) { // There is a connection and a player
            queue = await play(message, args, queue, connection, player);
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
            console.log(connection);
        } else {
            message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        }
    }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        await destroy(message);
    }

    // Pause
    if (command === "pause") {
        await pause(message, player);
    }

    // Join
    if (command === "join") {
        if (!connection) { // No connection, just join
            console.log(connection);
            connection = await join(message);
        } else { // There is connection, already in a voice channel
            message.channel.send("❌ **I am already in `" + message.member.voice.channel.name + "`!**");
        }
    }
});


// Activate bot
client.login(config.token);