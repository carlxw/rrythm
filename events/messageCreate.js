module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
        const config = require("../config.json");
        const connection = require("../index.js");

        // Isolate arguments (array) and command
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        args = format(args);
        const cmd = message.client.commands.get(command); // Method to run

        // There is no prefix or the author is the bot
        if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
        // User must be in a voice channel to use commands
        if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");
        // Command does not exist
        if (!cmd) return;
        // Do not run following commands; musicPlayer and connection DNE
        if ((command === "clear") || 
        (command === "loop") || 
        (command === "pause") || 
        (command === "playTop" || command === "ptop") || 
        (command === "queue" || command === "q") || 
        (command === "remove") &&
        (!connection.getConnection() || !connection.getMusicPlayer())) return;
        
        // Create a connection if it does not exist
        if ((command === "play" || command === "p") && !connection.getConnection()) connection.createConnection(message);
        
        try {
            await cmd(message, args);
        } catch (error) {
            console.error(error);
        }
	},
};

// Formats all entries from an array to a single string
const format = (arr) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) {
        output = output + arr[i] + " ";
    }
    return output.trim();
}