module.exports = disonnect = async (message) => {
    await message.channel.send("Instance destroyed");
    process.exit();
}