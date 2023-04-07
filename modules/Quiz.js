const fs = require("fs/promises");
const { createCustomEmbed } = require("../embedHelper");
const { assignRole } = require("./quizRoles");

class Quiz {
	constructor() {
		this.active = false;
		this.answeredCorrectly = [];
		this.answeredIncorrectly = [];
		this.index = -1;
		this.questions = null;
		this.quizId = null;
	}

	async complete(interaction) {
		console.log("quiz.complete");

		this.active = false;

		const quizOptions = {
			title: `Quiz Results`,
			description: `Score: ${this.score()}%`,
			color: "#0099ff",
		};

		const { embed, ephemeral } = createCustomEmbed(quizOptions);

		if (this.answeredIncorrectly.length) {
			embed.addFields({
				name: "Missed Questions",
				value: this.answeredIncorrectly
					.map(question => {
						const answer = question.options[question.correctIndex];
						return (
							question.question +
							` **The right answer was: ${answer}**`
						);
					})
					.join("\n"),
			});
		}

		await interaction.update({
			embeds: [embed],
			components: [],
			ephemeral,
		});
	}

	hasQuiz() {
		return this.active;
	}

	id() {
		return this.quizId;
	}

	isActive() {
		return this.active;
	}

	isLastQuestion() {
		return !(this.index + 1 < this.questions.length);
	}

	async loadQuiz(quizId) {
		const json = await this.loadQuizJson();
		if (json == false) return false;

		this.quizId = quizId;
		this.questions = json[quizId];
		this.active = true;

		return true;
	}

	async loadQuizJson() {
		try {
			const data = await fs.readFile("quizzes.json");
			const json = JSON.parse(data);
			return json;
		} catch (error) {
			console.error(`Error loading quiz id: ${quizId}, message: `, error);
			return false;
		}
	}

	processAnswer(answer) {
		const question = this.questions[this.index];
		const answerIndex = question.options.indexOf(answer);

		if (answerIndex != question.correctIndex) {
			this.answeredIncorrectly.push(question);
			return;
		}

		this.answeredCorrectly.push(question);
	}

	score() {
		return Math.round(
			(this.answeredCorrectly.length / this.questions.length) * 100
		);
	}

	async showNextQuestion(interaction) {
		console.log("Quiz - showNextQuestion");
		console.log("interaction id:", interaction.id);
		console.log("interaction message", interaction.message.id);

		this.index += 1;

		const question = this.questions[this.index];

		const buttons = question.options.map(option => {
			return { customId: option, label: option };
		});

		const quizOptions = {
			title: `Question ${this.index + 1}`,
			description: question.question,
			color: "#0099ff",
			buttons: buttons,
		};

		const { embed, row, ephemeral } = createCustomEmbed(quizOptions);

		await interaction.update({
			embeds: [embed],
			components: [row],
			ephemeral,
		});
	}

	totalMissed() {
		return this.answeredIncorrectly.length;
	}
}

module.exports = Quiz;
