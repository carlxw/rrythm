module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
        const config = require("../config.json");
        const connection = reqiore("../index.js");
        const musicPlayer = connection.getMusicPlayer();
        
        if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

        // User must be in a voice channel to use commands
        if (!message.member.voice.channel) message.channel.send("❌ **You have to be in a voice channel to use this command.**");

        // Isolate arguments (array) and command
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        args = format(args);

        const cmd = message.client.commands.get(command);
        if (!cmd) return
        
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