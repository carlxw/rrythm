const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const play = require("./commands/play.js");
const disconnect = require("./commands/disconnect.js");
let connection = null;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

client.on("ready", () => {
    console.log("Rrythm is active!");
});

client.on("messageCreate", async message => {
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "play" || command === "p") {
        connection = play(message, args);
    } else if (command === "disconnect" || command === "dc") {
        disconnect(message, client, connection);
        connection = null;
    }
});

client.login(config.token);