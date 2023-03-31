class YouTubeStream {
    // An object to store data
    constructor(link, title, channel, duration, thumbnail, stream, isLive, requestedBy) {
        this.link = link; // URL
        this.title = title; // String
        this.channel = channel; // String
        this.duration = duration; // int
        this.thumbnail = thumbnail; // URL
        this.stream = stream; // Object
        this.isLive = isLive; // bool
        this.requestedBy = requestedBy; // String
    }
}

module.exports = YouTubeStream;