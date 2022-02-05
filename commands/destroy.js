module.exports = disonnect = async (musicPlayer) => {
    musicPlayer.disconnect();
    console.log("Instance destroyed");
    process.exit();
}