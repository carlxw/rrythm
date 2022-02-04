/**
 * Changes the song if the song ended, or skip is called
 */
module.exports = changeSong = (player) => {
    const queue = require("../index.js");
    console.log(queue.peek()[1])
    let title;
    let url;
    [title, url]
    player.play(search(queue.pop()[1])[1]);
}