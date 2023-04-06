// main.js

require("dotenv").config();
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { doQuizButton, getQuiz, startQuiz } = require("./modules/quizManager");
const { init: quizRolesInit } = require("./modules/quizRoles");

quizRolesInit();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

const config = require("./config.json");

client.commands = new Collection();

// Read command files from the 'commands' folder
const commandFiles = fs
	.readdirSync("./commands")
	.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(`Loaded command: ${command.data.name}`);
}

client.once("ready", async () => {
	console.log(`Logged in as ${client.user.tag}!`);

	// Register slash commands to your bot globally
	const commands = await client.application.commands.set(
		client.commands.map(({ data }) => data)
	);

	console.log("Registered slash commands.");
});

client.on("interactionCreate", async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);

			await interaction.reply({
				content: "There was an error trying to execute that command.",
				ephemeral: true,
			});

			logError(`${new Date().toISOString()} - ${error}\n`);
		}
	} else if (interaction.isButton()) {
		console.log(`Button interaction received: ${interaction.customId}`);

		const quiz = getQuiz(interaction.message.id);

		if (!quiz) return startQuiz(interaction);

		if (quiz.isActive()) return doQuizButton(interaction);
	}
});

client.login(process.env.BOT_TOKEN);

function logError(message) {
	fs.appendFile(config.errorLog, message, err => {
		if (err) console.error(`Error writing to log file: ${err}`);
	});
}
