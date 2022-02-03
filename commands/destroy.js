module.exports = disonnect = (message) => {
    message.channel.send("Instance destroyed!");
    process.exit();
}