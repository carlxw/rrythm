const { Client, Intents } = require("discord.js");

// Import from config.json
const config = require("./config.json");

// Import from ./commands/.js
const play = require("./commands/play.js");
const disconnect = require("./commands/disconnect.js");
const destroy = require("./commands/destroy.js");
const pause = require("./commands/pause.js");
const unpause = require("./commands/unpause.js");

// Voice player
let connection;
let player;

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

    // Command handling
    if (command === "play" || command === "p") {
        if (!connection && !player) { // No connection
            [connection, player] = play(message, args, client);
        } else { // Unpause 
            unpause(message, client, connection, player);
        }
    } else if (command === "disconnect" || command === "dc") {
        [connection, player] = disconnect(message, client, connection, player);
    } else if (command === "destroy" || command === "d") {
        destroy(message);
    } else if (command === "pause") {
        pause(message, client, connection, player);
    }
});


// Activate bot
client.login(config.token);