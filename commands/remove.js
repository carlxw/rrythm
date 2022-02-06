module.exports = command = (musicPlayer, message, num) => {
    try {
        const array = musicPlayer.getQueue().getArrayReference();
        console.log(2)
        const removedIndex = array[num-1];
        console.log(2)
        array.splice(num-1, 1)
        console.log(2)
        message.channel.send("✅ **Removed** `" + removedIndex[1] + "`");
    } catch (error) {
        console.log("error")
        return;
    }
}