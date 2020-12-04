const Discord = require('discord.js');
const { config } = require('./configHelper');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

async function sendMessage(title, message, link) {
    console.log('sending', title, '\n', message);
    let fullMsg = `[${ title }](${ link })\n${ message.join('\n') }`;
    await webhookClient.send(fullMsg, {
        username: 'AOC Leaderboard Monitor',
    });
}

module.exports = { sendMessage };