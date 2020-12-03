import { readFileSync } from "fs";
import * as config from "../config.json";

export function getBoardUrl() {
    const link = config.leaderboardUrl;
    return link;
}
export function getLastLeaderBoard() {
    return readFileSync('./data/aocleaderboard.json', { encoding: 'utf8' })
}
async function fetchLeaderBoard(): Promise<string> {
    return readFileSync('./data/newleaderboard.json', { encoding: 'utf8' })
}
export async function getNewLeaderBoard() {
    const newLeaderBoardJson = await fetchLeaderBoard();
    // fs.writeFileSync('./data/aocleaderboard.json', newLeaderBoardJson) // TODO
    return newLeaderBoardJson;
}