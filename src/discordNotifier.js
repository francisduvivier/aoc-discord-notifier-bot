const Discord = require('discord.js');
const { config } = require('./configHelper');


async function sendMessage(title, message, postFix) {
    const webhookClient = new Discord.WebhookClient({ url: config.webhookUrl });
    console.log('Sending to Discord', title, '\n' + message);
    let message_with_cuttoff = message;
    let DISCORD_CHAR_LIMIT = 2000;
    if (message_with_cuttoff.length > DISCORD_CHAR_LIMIT - 6) { // 6 for 2x'```'
        message_with_cuttoff = message_with_cuttoff.substr(0, DISCORD_CHAR_LIMIT - 10) + '\n...';
    }
    await webhookClient.send({
        content: title,
        username: 'AoC Leaderboard Monitor',
        embeds: [ { title: 'Change List', description: '```' + message_with_cuttoff + '```' }, { description: postFix } ]
    });
}

module.exports = { sendMessage };