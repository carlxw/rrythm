module.exports = async () => {
    const {musicPlayer, connection} = require("../index.js")
    console.log(musicPlayer)
    console.log(connection.getConnection())
}