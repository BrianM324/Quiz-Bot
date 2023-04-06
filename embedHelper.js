// embedHelper.js 1

const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

function createCustomEmbed({ title, description, color, buttons }) {
	const embed = new EmbedBuilder()
		.setColor(color)
		.setTitle(title)
		.setDescription(description);

	if (buttons) {
		const row = new ActionRowBuilder().addComponents(
			buttons.map(button =>
				new ButtonBuilder()
					.setCustomId(button.customId)
					.setLabel(button.label)
					.setStyle(button.style || "1")
			)
		);
		return { embed: embed, row: row, ephemeral: true };
	} else {
		return { embed: embed, ephemeral: true };
	}
}

module.exports = { createCustomEmbed };
