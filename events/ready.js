const { generateDependencyReport } = require("@discordjs/voice");

module.exports = {
	name: "ready",
	once: true,
	execute() {
        console.log("Rrythm is active!");
        console.log(generateDependencyReport());
	},
};