const fs = require("fs/promises");

let quizRoles = {};

async function assignRole(guildId, quizId, member) {
	const roleId = getRoleAssignment(guildId, quizId);
	if (!roleId) {
		console.log(`No role set for quiz: ${quizId}, on guildId: ${guildId}`);
		return false;
	}

	try {
		await member.roles.add([roleId]);
		return true;
	} catch (error) {
		console.log(`Failed assigning role: ${roleId}, on guildId: ${guildId}`);
		return false;
	}
}

function getRoleAssignment(guildId, quizId) {
	if (!(guildId in quizRoles)) return false;

	return quizRoles[guildId][quizId] || false;
}

async function init() {
	quizRoles = await loadConfig();
	console.log("Quiz Role Assignment Loaded.");
}

async function loadConfig() {
	try {
		const data = await fs.readFile("quiz-roles.json");
		const json = JSON.parse(data);
		return json;
	} catch (error) {
		console.error("Error loading quiz roles", error);
		return false;
	}
}

async function saveConfig() {
	console.log("Quiz Roles: Save Config.");

	try {
		const json = JSON.stringify(quizRoles);
		await fs.writeFile("quiz-roles.json", json);
		return true;
	} catch (error) {
		console.error("Error loading quiz roles", error);
		return false;
	}
}

function saveRoleAssignment(guildId, quizId, roleId) {
	if (!(guildId in quizRoles)) quizRoles[guildId] = {};

	quizRoles[guildId][quizId] = roleId;

	return saveConfig();
}

module.exports = {
	assignRole,
	init,
	saveRoleAssignment,
};
