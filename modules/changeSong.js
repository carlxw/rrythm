/**
 * Changes the song if the song ended, or skip is called
 */
module.exports = changeSong = (player) => {
    queue = require("../index.js");
    console.log(queue.pop());
}