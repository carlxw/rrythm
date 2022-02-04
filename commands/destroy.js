module.exports = disonnect = async (message) => {
    message.channel.send("Instance destroyed!");
    process.exit();
}