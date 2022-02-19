module.exports = (message) => {
    const { connection } = require("../index.js");
    const musicPlayer = connection.getMusicPlayer();
    /*
    if !loop:
        loop bot - whenever a song ends, musicplayer will play the recent popped
    else:
        unloop bot - change a boolean in musicPlayer
    */
}