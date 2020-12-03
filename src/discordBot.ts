import { getBoardUrl, getLastLeaderBoard, getNewLeaderBoard } from "./aocLeaderBoardPoller";
import { sendMessage } from "./discordNotifier";

runBot();

const POLLING_INTERVAL = 15 * 60 * 1000;
async function runBot() {
    console.log('Bot Started!')
    await postToDiscordIfChanged();
    setInterval(() => postToDiscordIfChanged(), POLLING_INTERVAL);
}
async function postToDiscordIfChanged() {
    console.log('Checking leaderboard now');
    const oldLeaderBoardJSON = getLastLeaderBoard();
    const newLeaderboardJSON = await getNewLeaderBoard();
    if (leaderBoardChanged(oldLeaderBoardJSON, newLeaderboardJSON)) {
        const description = createMessage(newLeaderboardJSON);
        sendMessage('Leaderboard Changed!', description, getBoardUrl());
    }
}

function createMessage(leaderboardJSON: string) {
    const leaderboard = JSON.parse(leaderboardJSON);
    const membersObj = leaderboard.members;
    return Object.getOwnPropertyNames(membersObj).map(key => membersObj[key].name + ': ' + membersObj[key].local_score);
}

function leaderBoardChanged(oldLeaderBoardJSON: any, newLeaderboardJSON: string) {
    return JSON.stringify(JSON.parse(oldLeaderBoardJSON)) !== JSON.stringify(JSON.parse(newLeaderboardJSON));
}


