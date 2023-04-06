const { createCustomEmbed } = require("../embedHelper");
const Quiz = require("./Quiz");

const activeQuizzes = {};

async function doQuizButton(interaction) {
	const quiz = getQuiz(interaction.message.id);

	const answer = interaction.customId;
	quiz.processAnswer(answer);

	if (quiz.isLastQuestion()) return quiz.complete(interaction);

	await quiz.showNextQuestion(interaction);
}

function getQuiz(messageId) {
	return activeQuizzes[messageId] || false;
}

async function showAvailableQuizzes(interaction) {
	console.log("showAvailableQuizzes");

	const quiz = new Quiz();
	const json = await quiz.loadQuizJson();
	if (json == false) return false;

	const buttons = Object.keys(json).map(quiz => {
		return { customId: quiz, label: quiz };
	});

	const quizOptions = {
		title: "Select a Quiz",
		description: "Choose a quiz to start playing.",
		color: "#0099ff",
		buttons,
	};

	const { embed, row, ephemeral } = createCustomEmbed(quizOptions);

	await interaction.reply({
		embeds: [embed],
		components: [row],
		ephemeral,
	});
}

async function startQuiz(interaction) {
	const messageId = interaction.message.id;
	const quizId = interaction.customId;

	const quiz = new Quiz();
	if (!(await quiz.loadQuiz(quizId))) return false;
	quiz.showNextQuestion(interaction);

	activeQuizzes[messageId] = quiz;

	return true;
}

module.exports = {
	doQuizButton,
	getQuiz,
	showAvailableQuizzes,
	startQuiz,
};
