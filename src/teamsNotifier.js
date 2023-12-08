const Discord = require('discord.js');
const { config } = require('./configHelper');

async function sendMessage(title, message, postFix) {
    console.log('Sending to Discord', title, '\n' + message);
    let message_with_cuttoff = message;
    const CHAR_LIMIT = 2000;
    if (message_with_cuttoff.length > CHAR_LIMIT - 6) { // 6 for 2x'```'
        message_with_cuttoff = message_with_cuttoff.substr(0, CHAR_LIMIT - 10) + '\n...';
    }
    const caddy = {
        //TODO
    };
    await fetch(config.webhookUrl, { method: 'POST', body: JSON.stringify(caddy) });
}

module.exports = { sendMessage };