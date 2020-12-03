import Discord from 'discord.js';
import { config } from "./configHelper";

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

export async function sendMessage(title, message, link) {
    console.log('sending', title, '\n', message, '\n', link)
    const embedMsg = new Discord.MessageEmbed().setDescription(message);
    const embedLink = new Discord.MessageEmbed().setTitle('Private Leader Board').setURL(link);
    await webhookClient.send(title, {
        username: 'AOC Bot',
        avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embedLink, embedMsg],
    });
}

