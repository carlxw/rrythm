const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");

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

// Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    // console.log(`[EVENT HANDLER] - ${file} has been loaded.`);
}

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
    const commandExport = require(`./commands/${file}`);
    const commandName = file.split(".")[0];
    client.commands.set(commandName, commandExport);
    // console.log(`[COMMAND HANDLER] - ${file} has been loaded.`);
}

// Activate bot
client.login(config.token);