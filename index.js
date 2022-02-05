const { Client, Intents } = require("discord.js");
const Queue = require("./modules/Queue.js");

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
    console.log("Rrythm is active!");
});

// Import from ./commands/.js
// const play = require("./commands/play.js");
// const disconnect = require("./commands/disconnect.js");
const destroy = require("./commands/destroy.js");
// const pause = require("./commands/pause.js");
// const unpause = require("./commands/unpause.js");
// const join = require("./commands/join.js");
const MusicPlayer = require("./modules/Musicplayer.js");

// Voice player
let musicPlayer;

// On event: new message created
client.on("messageCreate", async message => {
    // Ignore messages sent by bot and without prefix
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
    // Isolate arguments (array) and command
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    args = format(args);

    // Play, queue, unpause
    if (command === "play" || command === "p") {
        if (!message.member.voice.channel) {
            console.log("User not connected to voice channel");
        } else if (!args) {
            console.log("No argument");
        } else if (!musicPlayer) { // Not running
            musicPlayer = new MusicPlayer(message);
            await musicPlayer.enqueue(args);
            console.log(`Playing ${args}`)
        } else { // Unpause 
            unpause(message, player);
        }
    }

    // Disconnect
    if (command === "disconnect" || command === "dc") {
        if (!musicPlayer) {
            console.log("Nothing to disconnect");
        } else {
            musicPlayer.disconnect();
            musicPlayer = null;
        }
    }

    // // Pause
    // if (command === "pause") {
    //     await pause(message, player, connection);
    // }

    // // Join
    // if (command === "join") {
    //     if (!connection) { // No connection, just join
    //         connection = await join(message);
    //     } else { // There is connection, already in a voice channel
    //         message.channel.send("❌ **I am already in `" + message.member.voice.channel.name + "`!**");
    //     }
    // }

    // Development - destroy
    if (command === "destroy" || command === "d") {
        await destroy(musicPlayer);
    }

    if (command === "state") {
        message.channel.send(player.state.status);
    }
});

// Activate bot
client.login(config.token);

const format = (arr) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) {
        output = output + arr[i] + " ";
    }
    return output.trim();
}

module.exports = musicPlayer;