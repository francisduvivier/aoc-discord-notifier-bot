const { DUMMY_BOARD } = require('./configHelper');
const { createSummary } = require('./boardProcessor');
const { createMemberLines } = require('./boardProcessor');
const { boardUrl, getLastLeaderBoard, getNewLeaderBoard } = require('./aocFetch');
const { sendMessage } = require('./messager');

const POLLING_INTERVAL = DUMMY_BOARD ? 10 * 1000 : 15 * 60 * 1000;

async function runBot() {
    console.log('Bot Started!');
    const oldLeaderBoardJson = getLastLeaderBoard();
    console.log('Leaderboard from last run:', '\n' + (createMemberLines(oldLeaderBoardJson, '{}') || 'EMPTY'));
    await postToDiscordIfChanged();
    setInterval(postToDiscordIfChanged, POLLING_INTERVAL);
}

async function postToDiscordIfChanged() {
    console.log(new Date(), `Checking leaderboard now! Next check in [${Math.round(POLLING_INTERVAL / 60 / 1000).toFixed(0)} min]`);
    const oldLeaderBoardJson = getLastLeaderBoard();
    const newLeaderboardJson = await getNewLeaderBoard();
    const message = createMemberLines(newLeaderboardJson, oldLeaderBoardJson);
    if (message.length) {
        const summary = createSummary(newLeaderboardJson, oldLeaderBoardJson);
        await sendMessage(summary, message, `Full [Leaderboard](${boardUrl})`);
    } else {
        console.log(`No change detected.`);
    }
}

module.exports = { runBot };
