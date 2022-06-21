const play = require("play-dl")

module.exports = async (message, musicPlayer, discord, args) => {
    const YouTube = require("../modules/YouTube.js")
    const yt = new YouTube()
    const link = "https://www.youtube.com/playlist?list=PL7gLKrBkQPikV6vpSsEVwlrQc0Bo0nsiP"
    const playlist = await yt.acquirePlaylist(link);
    console.log(playlist)
}

// yt.channel.name - creator
// yt.title - title
// yt.videoCount - number of videos
// yt.link - Link to playlist