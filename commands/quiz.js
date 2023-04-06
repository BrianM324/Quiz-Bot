const { SlashCommandBuilder } = require("@discordjs/builders");
const { showAvailableQuizzes } = require("../modules/quizManager");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("quiz")
		.setDescription("Start a quiz with multiple options"),

	async execute(interaction) {
		console.log("Quiz command executed.");
		showAvailableQuizzes(interaction);
	},
};
