class AudioYouTube {
    constructor(link, title, channel, duration, thumbnail, stream, isLive, requested) {
        this.link = link;
        this.title = title;
        this.channel = channel;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.stream = stream; 
        this.isLive = isLive;
        this.requested = requested;
    }
}

module.exports = AudioYouTube;