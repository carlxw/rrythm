module.exports = async () => {
    const { connection } = require("../index.js")
    console.log(connection.getMusicPlayer().getQueue().peek());
}