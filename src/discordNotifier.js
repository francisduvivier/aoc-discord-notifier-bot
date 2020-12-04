const Discord = require('discord.js');
const { config } = require('./configHelper');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

async function sendMessage(title, message) {
    console.log('sending', title + '\n' + message);

    await webhookClient.send(title, {
        username: 'AoC Leaderboard Monitor',
        embeds: [ { description: '```'+message+'```' } ]
    });
}

module.exports = { sendMessage };