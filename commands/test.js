const play = require("play-dl")

module.exports = async (message, musicPlayer, discord, args) => {
    // at the top of your file
    const { MessageEmbed } = require('discord.js');

    // inside a command, event listener, etc.
    const exampleEmbed = new MessageEmbed()
        .setColor('#FF3741')
        .setTitle("PLAYLIST TITLE")
        .setAuthor({ name: "Playlist added to queue", iconURL: "https://i.imgur.com/dGzFmnr.png" })
        .setDescription("**Enqueued** `PLAYLIST NUM` **songs**")
        .setTimestamp()
        .setFooter({ text: "Rrythm Bot", iconURL: "https://i.imgur.com/dGzFmnr.png" });
    message.channel.send({ embeds: [exampleEmbed] });
}

// yt.channel.name - creator
// yt.title - title
// yt.videoCount - number of videos
// yt.link - Link to playlist