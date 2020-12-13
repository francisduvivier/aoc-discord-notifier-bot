const { readFileSync, writeFileSync } = require('fs');
const fetch = require('node-fetch');
const { getDummyBoard } = require("./test/dummyBoard");
const {
    KEEP_ALL_LEADERBOARDS,
    DUMMY_BOARD,
    DONT_USE_PERMANENT_STORAGE
} = require("./configHelper");
const { config } = require('./configHelper');

const boardUrl = config.leaderboardUrl;
const jsonBoardUrl = boardUrl + '.json';

let lastLeaderBoard = '{}';

function getLastLeaderBoard() {
    try {
        if (DONT_USE_PERMANENT_STORAGE || DUMMY_BOARD) {
            return lastLeaderBoard;
        } else {
            return readFileSync('./data/aocleaderboard.json', { encoding: 'utf8' })
        }
    } catch {
        return '{}';
    }
}

async function fetchLeaderBoard() {
    console.log(`Requesting leaderboard from [${ boardUrl }]`)
    const requestInit = {
        headers: {
            'Cookie': config.aocCookie
        }
    };

    const response = await fetch(jsonBoardUrl, requestInit);
    const responseText = await (response).text();
    return responseText;
}

async function getNewLeaderBoard() {
    const newLeaderBoardJson = DUMMY_BOARD ? getDummyBoard() : await fetchLeaderBoard();
    if (newLeaderBoardJson.startsWith('{') && JSON.parse(newLeaderBoardJson).members) {
        if (DONT_USE_PERMANENT_STORAGE || DUMMY_BOARD) {
            lastLeaderBoard = newLeaderBoardJson;
        } else {
            if (KEEP_ALL_LEADERBOARDS) {
                writeFileSync(`./data/old/aocleaderboard-${ Date.now() }.json`, getLastLeaderBoard());
            }
            writeFileSync('./data/aocleaderboard.json', newLeaderBoardJson);
        }
    } else {
        throw Error('Bad leaderboard response:' + newLeaderBoardJson);
    }
    return newLeaderBoardJson;
}

module.exports = {
    boardUrl,
    getLastLeaderBoard,
    getNewLeaderBoard,
}