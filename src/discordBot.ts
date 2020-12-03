import { getBoardUrl, getLastLeaderBoard, getNewLeaderBoard } from "./aocLeaderboard";
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
        console.log('Old leaderboard!', createMessage(oldLeaderBoardJSON), getBoardUrl());
        await sendMessage('Leaderboard Changed!', description, getBoardUrl());
    } else {
        console.log('No change detected: ', createMessage(newLeaderboardJSON), getBoardUrl())
    }
}

function createMessage(leaderboardJSON: string) {
    const leaderboard = JSON.parse(leaderboardJSON);
    const membersObj = leaderboard.members;
    let members = membersObj && Object.getOwnPropertyNames(membersObj)?.map(key => membersObj[key]) || [];
    members.sort((m1, m2) => m2.local_score - m1.local_score);
    return members.map(member => `${member.name}: [${member.stars}] stars, [${member.local_score}] points`);
}

function leaderBoardChanged(oldLeaderBoardJSON: any, newLeaderboardJSON: string) {
    const msgNew = createMessage(oldLeaderBoardJSON).join('\n');
    const msgOld = createMessage(newLeaderboardJSON).join('\n');
    return msgNew != msgOld;
}


