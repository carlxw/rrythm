const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const MusicPlayer = require("./modules/MusicPlayer.js");
const Disconnect = require("./modules/Disconnect.js");
require("dotenv").config();

// Import from config.json
const config = require("./config.json");

// Initialize bot
const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// musicPlayer
let musicPlayer = new MusicPlayer();

// Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`[EVENT HANDLER] - ${file} has been loaded.`);
}

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
    const commandExport = require(`./commands/${file}`);
    const commandName = file.split(".")[0];
    if (commandName === "play") client.commands.set("p", commandExport);
    else if (commandName === "queue") client.commands.set("q", commandExport);
    else if (commandName === "disconnect") client.commands.set("dc", commandExport);
    else if (commandName === "skip")  client.commands.set("s", commandExport);
    else if (commandName === "playtop") client.commands.set("ptop", commandExport);
    else if (commandName === "nowplaying") client.commands.set("np", commandExport);
    client.commands.set(commandName, commandExport);
    console.log(`[COMMAND HANDLER] - ${file} has been loaded.`);
}

// Activate bot and logic
client.login(process.env.DISCORD_TOKEN);
module.exports = { musicPlayer };

// Check if the internet is disconnected every 60 seconds. Quit on internet disconnect
const disconnect = new Disconnect();
disconnect.run(60000);