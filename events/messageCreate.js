module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
        const config = require("../config.json");
        let { musicPlayer } = require("../index.js");
        const Discord = require("../modules/Discord.js");
        const discord = new Discord();

        // Isolate arguments (array) and command
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        args = format(args);
        const cmd = message.client.commands.get(command); // Method to run

        // There is no prefix or the author is the bot
        if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
        // User must be in a voice channel to use commands
        if (!message.member.voice.channel) {
            message.channel.send("❌ **You have to be in a voice channel to use this command.**");
            return;
        }
        // Command does not exist
        if (!cmd) return;

        // Do not run following commands; musicPlayer DNE, not in set voice channel, not in set text channel
        if ((!musicPlayer.connection || (message.channel.name !== musicPlayer.textChannel || message.member.voice.channel.name !== musicPlayer.voiceChannel)) && (
            (command === "clear") || 
            (command === "loop") || 
            (command === "pause") || 
            (command === "playTop" || command === "ptop") || 
            (command === "queue" || command === "q") || 
            (command === "disconnect" || command === "dc") || 
            (command === "nowplaying" || command === "np") || 
            (command === "remove")
        )) {
            if (!musicPlayer.connection) message.channel.send("❌ **I am not in a voice channel.**");
            return;
        }

        // Play - Create a musicPlayer if it does not exist OR ignore if command is sent in a different channel
        if ((command === "play" || command === "p") && !musicPlayer.connection) musicPlayer.create(message);
        // Play - Ignore command if it is found in a different channel
        if ((command === "play" || command === "p") && (message.channel.name !== musicPlayer.textChannel || message.member.voice.channel.name !== musicPlayer.voiceChannel))
        // Play - If there are no args, try unpausing. 
        if ((command === "play" || command === "p") && !args) return;

        // Execute command
        try {
            await cmd(message, musicPlayer, discord, args);
        } catch (error) {
            console.error(error);
        }
	}
};

// Formats all entries from an array to a single string
const format = (arr) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) {
        output = output + arr[i] + " ";
    }
    return output.trim();
}