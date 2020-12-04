const { readFileSync, writeFileSync } = require('fs');
const fetch = require('node-fetch');
const { config } = require('./configHelper');

const DUMMY_BOARD = process.env.DUMMY_BOARD === 'true';
const KEEP_ALL_LEADERBOARDS = process.env.KEEP_ALL_LEADERBOARDS === 'true';

function getBoardUrl() {
    return config.leaderboardUrl;
}

function getLastLeaderBoard() {
    try {
        return readFileSync('./data/aocleaderboard.json', { encoding: 'utf8' })
    } catch {
        return '{}';
    }
}

async function fetchLeaderBoard() {
    if (DUMMY_BOARD) {
        console.log(`Reading from file [./data/newleaderboard.json] instead of fetching from [${ getBoardUrl() }]`)
        return readFileSync('./data/newleaderboard.json', { encoding: 'utf8' });
    }
    console.log(`Requesting leaderboard from [${ getBoardUrl() }]`)
    const requestInit = {
        headers: {
            'Cookie': config.aocCookie
        }
    };
    const response = await fetch(getBoardUrl() + '.json', requestInit);
    const responseText = await (response).text();
    return responseText;
}

async function getNewLeaderBoard() {
    const newLeaderBoardJson = await fetchLeaderBoard();
    if (newLeaderBoardJson.startsWith('{') && JSON.parse(newLeaderBoardJson).members) {
        if (KEEP_ALL_LEADERBOARDS) {
            writeFileSync(`./data/old/aocleaderboard-${ Date.now() }.json`, getLastLeaderBoard());
        }
        writeFileSync('./data/aocleaderboard.json', newLeaderBoardJson);
    } else {
        throw Error('Bad leaderboard response:' + newLeaderBoardJson);
    }
    return newLeaderBoardJson;
}

module.exports = {
    getBoardUrl,
    getLastLeaderBoard,
    getNewLeaderBoard,
}