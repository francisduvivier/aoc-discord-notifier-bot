const Discord = require('discord.js');
const { config } = require('./configHelper');
const fetch = require('node-fetch');
const { inspect } = require('util');

function createCell(text) {
    return {
        'type': 'TableCell',
        'items': [
            {
                'type': 'TextBlock',
                'text': text,
                'wrap': false
            }
        ]
    };
}

function createCells(line) {
    return line.split('|').map(createCell);
}

function createTable(message) {
    const lines = message.split('\n');
    return lines.map(line => {
        let cells = line.split('|');
        return {
            'title': cells[ 0 ],
            'value': cells.slice(1).join('|')
        };
    });
}

function createAdaptiveCard(title, message) {
    return {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'type': 'AdaptiveCard',
        'version': '1.0',
        'text': '★AOC Update★:' + title,
        'body': [
            {
                'type': 'FactSet',
                'facts': createTable(message.replaceAll('★', '*'))
            }
        ],
    };
}

async function sendMessage(title, message, postFix) {
    console.log('Sending to Teams', title, '\n' + message);
    const adaptiveCard = createAdaptiveCard(title, message);
    console.log('CARD TO BE SENT to TEAMS', JSON.stringify(adaptiveCard));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adaptiveCard),
        redirect: 'follow'
    };
    if (process.env.DUMMY_BOARD !== 'true') {
        const result = await fetch(config.webhookUrl, requestOptions);
        console.log('Fetch response status', result.status);
        console.log('Fetch response status', result.statusText);
        const responseText = await result.text();
        console.log('Fetch response text', responseText);
    }
}

module.exports = { sendMessage, createAdaptiveCard, createCells };