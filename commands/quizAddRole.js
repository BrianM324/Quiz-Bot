const { PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { saveRoleAssignment } = require("../modules/quizRoles");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("quiz-add-role")
		.setDescription(
			"Used to set the role the user recieves after passing the quiz."
		)
		.addStringOption(option =>
			option
				.setName("quiz")
				.setDescription("The id of the quiz")
				.setRequired(true)
		)
		.addRoleOption(option =>
			option
				.setName("role")
				.setDescription("The assigned role")
				.setRequired(true)
		),

	async execute(interaction) {
		console.log("quizAddRole command executed.");

		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Flags.Administrator
			)
		) {
			return await interaction.reply({
				content: "You do not have permissions to run this command",
				ephemeral: true,
			});
		}

		const guildId = interaction.guildId;
		const quizId = interaction.options.getString("quiz");
		const roleId = interaction.options.getRole("role").id;

		if (!saveRoleAssignment(guildId, quizId, roleId)) {
			return await interaction.reply({
				content: "Failed adding role to quiz",
				ephemeral: true,
			});
		}

		await interaction.reply({
			content: "Role successfully added to quiz",
			ephemeral: true,
		});
	},
};
