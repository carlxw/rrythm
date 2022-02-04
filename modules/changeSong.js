/**
 * Changes the song if the song ended, or skip is called
 */
module.exports = changeSong = (player) => {
    const queue = require("../index.js");
    console.log(queue.pop());
}