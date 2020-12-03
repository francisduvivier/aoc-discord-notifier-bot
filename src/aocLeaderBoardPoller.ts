import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import * as config from "../config.json";
const DEBUG = false;

export function getBoardUrl() {
    const link = config.leaderboardUrl;
    return link;
}
export function getLastLeaderBoard() {
    try {
        return readFileSync('./data/aocleaderboard.json', { encoding: 'utf8' })
    } catch {
        return '{}';
    }
}
async function fetchLeaderBoard(): Promise<string> {
    if (DEBUG) {
        return readFileSync('./data/newleaderboard.json', { encoding: 'utf8' });
    }
    const requestInit = {
        headers: {
            'Cookie': config.aocCookie
        }
    };
    const response = await fetch(getBoardUrl() + '.json', requestInit);
    const responseText = await (response).text();
    return responseText;
}
export async function getNewLeaderBoard() {
    const newLeaderBoardJson = await fetchLeaderBoard();
    if (newLeaderBoardJson.startsWith('{') && JSON.parse(newLeaderBoardJson).members) {
        writeFileSync(`./data/old/aocleaderboard-${Date.now()}.json`, getLastLeaderBoard());
        writeFileSync('./data/aocleaderboard.json', newLeaderBoardJson);
    } else {
        throw Error('Bad leaderboard response:' + newLeaderBoardJson);
    }
    return newLeaderBoardJson;
}