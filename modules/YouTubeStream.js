class YouTubeStream {
    // An object to store data
    constructor(link, title, channel, duration, thumbnail, stream, isLive, requestedBy) {
        this.link = link;
        this.title = title;
        this.channel = channel;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.stream = stream; 
        this.isLive = isLive;
        this.requestedBy = requestedBy;
    }
}

module.exports = YouTubeStream;