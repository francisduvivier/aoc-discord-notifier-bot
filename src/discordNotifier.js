const Discord = require('discord.js');
const { config } = require('./configHelper');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

async function sendMessage(title, message, link) {
    console.log('sending', title, '\n', message);
    const embedMsg = new Discord.MessageEmbed().setDescription(message);
    const embedLink = new Discord.MessageEmbed().setTitle('Private Leader Board').setURL(link);
    await webhookClient.send(title, {
        username: 'AOC Bot',
        avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embedLink, embedMsg],
    });
}

module.exports = { sendMessage };