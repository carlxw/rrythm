const config = require("../config.json");

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
        if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

        // Isolate arguments (array) and command
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        args = format(args);

        const cmd = message.client.commands.get(command);
        if (!cmd) return
        
        try {
            await cmd();
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