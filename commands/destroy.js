module.exports = disonnect = async (musicPlayer) => {
    if (musicPlayer) musicPlayer.disconnect();
    console.log("Instance destroyed");
    process.exit();
}