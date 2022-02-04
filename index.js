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
    console.log("Rythm is active!");
});

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

    // Isolate arguments (array) and command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    await run(command, args, message);
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
let queue; // Queue of songs

// Command handling
const run = async (command, args, message) => {
    // Play, queue, unpause
    if (command === "play" || command === "p") {
        if (!connection) { // No connection: Create queue, connection, player
            [connection, player, queue] = await play(message, args);
        } else if (!queue) { // There is a connection, there is no queue and player
            
        } else { // Unpause 
            unpause(message, client, connection, player);
        }
    }

    // Disconnect
    if (command === "disconnect" || command === "dc") {
        if (connection && player) { // Connection and player
            [connection, player] = disconnect(message, client, connection, player);
        } else if (connection && !player) { // Connection, no player
            connection = disconnect(message, connection);
            console.log(connection);
        } else {
            message.channel.send("❌ **I am not connected to a voice channel. Type** `!join` **to get me in one**");
        }
    }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        destroy(message);
    }

    // Pause
    if (command === "pause") {
        pause(message, client, connection, player);
    }

    // Join
    if (command === "join") {
        if (!connection) { // No connection, just join
            console.log(connection);
            connection = join(message);
        } else { // There is connection, already in a voice channel
            message.channel.send("❌ **I am already in `" + message.member.voice.channel.name + "`!**");
        }
    }
}

// Activate bot
client.login(config.token);