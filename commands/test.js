module.exports = async () => {
    const {connection} = require("../index.js")
    console.log(connection.getMusicPlayer().getQueue())
    console.log(connection.getMusicPlayer().getQueue().getArray())
}