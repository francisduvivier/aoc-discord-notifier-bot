const { config } = require('./configHelper.js');
const discordNotifier = require('./discordNotifier.js');
const teamsNotifier = require('./teamsNotifier.js');

async function sendMessage(title, message, postFix) {
    switch (config.webhookType) {
    case 'MSTEAMS':
        return await teamsNotifier.sendMessage(title, message, postFix);
    case 'DISCORD':
    default:
        // Case DISCORD
        return await discordNotifier.sendMessage(title, message, postFix);
    }
}

module.exports = { sendMessage };