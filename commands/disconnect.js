module.exports = disonnect = (message) => {
    console.log("disconnecting");
    message.channel.send("Disconnected!");
}