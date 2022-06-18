class YouTubeStream {
    // An object to store data
    constructor(link, title, channel, duration, thumbnail, stream, isLive, requestedBy) {
        this.link = link; // [0]
        this.title = title; // [1]
        this.channel = channel; // [2]
        this.duration = duration; // [3]
        this.thumbnail = thumbnail; // [4]
        this.stream = stream; // [5] 
        this.isLive = isLive; // [6]
        this.requestedBy = requestedBy; // [7]
    }
}

module.exports = YouTubeStream;