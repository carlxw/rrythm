// Now playing
// Play top
// Loop queue
// Loop song
// Clear queue
// Commands while playing glitches playing (worker threads)

// https://www.npmjs.com/package/nodemon
// https://www.npmjs.com/package/forever

// play-dl (Maybe replace ytdl-core?)
// piscina

// Don"t immediately discard discord bot when queue is empty

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
    console.log(`[EVENT HANDLER] - ${file} has been loaded.`);
}

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
    const commandExport = require(`./commands/${file}`);
    const commandName = file.split(".")[0];
    client.commands.set(commandName, commandExport);
    console.log(`[COMMAND HANDLER] - ${file} has been loaded.`);
}

// Activate bot
client.login(config.token);

client.on("messageCreate", async message => {
	if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

	// Isolate arguments (array) and command
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    args = format(args);

    const cmd = client.commands.get(command);

	if (!cmd) return

    console.dir(client.commands);
	try {
		await cmd();
	} catch (error) {
		console.error(error);
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
    // musicPlayer,
    autodc
}