const { getBoardUrl, getLastLeaderBoard, getNewLeaderBoard } = require('./aocLeaderboard');
const { sendMessage } = require('./discordNotifier');

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
    const message = createMessage(newLeaderboardJSON, oldLeaderBoardJSON);
    if (message.length) {
        console.log('Old leaderboard!', createMemberLines(oldLeaderBoardJSON), getBoardUrl());
        await sendMessage('Leaderboard Changed!', message, getBoardUrl());
    } else {
        console.log('No change detected: ', createMemberLines(newLeaderboardJSON), getBoardUrl())
    }
}

function createMemberLines(leaderboardJSON) {
    const leaderboard = JSON.parse(leaderboardJSON);
    const membersObj = leaderboard.members;
    let members = membersObj && Object.getOwnPropertyNames(membersObj).map(key => membersObj[key]) || [];
    members.sort((m1, m2) => m2.local_score - m1.local_score);
    return members.map((member, index) => `**${ index + 1 }**: ${ member.name }: [**${ member.stars }**] stars, [**${ member.local_score }**] points`);
}

function createMessage(newLeaderboardJSON, oldLeaderBoardJSON) {
    const oldMemberLines = createMemberLines(oldLeaderBoardJSON);
    const newMemberLines = createMemberLines(newLeaderboardJSON);
    const changedLines = newMemberLines.filter((newLine) => oldMemberLines.indexOf(newLine) === -1);
    return changedLines;
}


module.exports = { runBot };
