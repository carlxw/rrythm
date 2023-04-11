class Disconnect {
    /**
     * Do nothing without affecting the program
     * 
     * @param {int} ms Time duration of sleep
     * @returns Promise
     */
    #sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Checks if the client is connected to the internet or not
     * 
     * @param {String} url Test webpage
     * @returns Boolean - True if connected to the internet
     */
    #isOnline = async (url = "http://www.google.ca") => {
        try {
            const online = await fetch(url);
            return (online.status >= 200 && online.status < 300);
        } catch (err) {
            return false;
        }
    };

    /**
     * Main check if client is disconencted or not
     * 
     * @param {int} time In ms, check every "time"-ms if client is disconnected or not
     */
    async run(time) {
        while (true) {
            await this.#sleep(time);
            
            let connected = await this.#isOnline()
            if (!connected) process.exit();
        }
    }
}

module.exports = Disconnect