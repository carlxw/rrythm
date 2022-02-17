module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        console.log("Rrythm is active!");
        const { generateDependencyReport } = require("@discordjs/voice");
        console.log(generateDependencyReport());
	},
};