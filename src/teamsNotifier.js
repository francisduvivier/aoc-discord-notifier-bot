const Discord = require('discord.js');
const { config } = require('./configHelper');
const fetch = require('node-fetch');

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
        return {
            'type': 'TableRow',
            'cells': createCells(line)
        };
    });
}

function createAdaptiveCard(title, message) {
    return {
        'type': 'AdaptiveCard',
        'body': [
            {
                'type': 'TextBlock',
                'size': 'Medium',
                'weight': 'Bolder',
                'text': 'Changes: ' + title
            },
            {
                'type': 'Table',
                'columns': [
                    {
                        'width': 1
                    },
                    {
                        'width': 5
                    },
                    {
                        'width': 2
                    },
                    {
                        'width': 2
                    },
                    {
                        'width': 4
                    }
                ],
                'rows': createTable(message)
            }
        ],
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'version': '1.6',
        'actions': [
            {
                'type': 'Action.OpenUrl',
                'title': 'Open LeaderBoard',
                'url': 'leaderbaordurl'
            }
        ]
    };
}

async function sendMessage(title, message, postFix) {
    console.log('Sending to Teams', title, '\n' + message);
    const adaptiveCard = createAdaptiveCard(title, message);
    console.log('CARD TO BE SENT to TEAS', JSON.stringify(adaptiveCard));
    if (process.env.DUMMY_BOARD !== 'true') {
        await fetch(config.webhookUrl, { method: 'POST', body: JSON.stringify(adaptiveCard) });
    }
}

module.exports = { sendMessage, createAdaptiveCard, createCells };