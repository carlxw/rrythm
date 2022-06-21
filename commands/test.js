const play = require("play-dl")

module.exports = async (message, musicPlayer, discord, args) => {
    console.log(message.member.voice.channel.members.size)
}

// yt.channel.name - creator
// yt.title - title
// yt.videoCount - number of videos
// yt.link - Link to playlist