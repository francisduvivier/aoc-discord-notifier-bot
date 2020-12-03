import Discord from 'discord.js';
import { readFileSync } from 'fs';
const config = JSON.parse(readFileSync('./config.json', { encoding: 'utf8' }));

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

export async function sendMessage(title, message, link) {
    console.log('sending', title, '\n', message.join('\n'), '\n', link)
    const embedMsg = new Discord.MessageEmbed().setDescription(message);
    const embedLink = new Discord.MessageEmbed().setTitle('Private Leader Board').setURL(link);
    await webhookClient.send(title, {
        username: 'AOC Bot',
        avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embedLink, embedMsg],
    });
}

