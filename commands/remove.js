module.exports = command = (musicPlayer, message, num) => {
    try {
        const array = musicPlayer.getQueue().getArrayReference();
        const removedIndex = array[num-1];
        array.splice(num-1, 1)
        message.channel.send("✅ **Removed** `" + removedIndex[1] + "`");
    } catch (error) {
        console.log("error")
        return;
    }
}