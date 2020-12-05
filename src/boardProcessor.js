const relevantProps = [
    { prefix: '', key: 'position', postfix: ' | ' },
    { prefix: '', key: 'name', postfix: ' | ' },
    { prefix: '', key: 'local_score', postfix: 'p | ' },
    { prefix: '', key: 'stars', postfix: '*' },
]

function createMemberlineElements(member, oldMember) {
    let anyChange = false;
    const lineElements = relevantProps.map(relavantProp => {
        const key = relavantProp.key;
        const oldVal = oldMember[key];
        const newVal = member[key];
        const changed = oldVal !== newVal;
        let text = String(newVal).substr(0, 20);
        if (changed) {
            anyChange = true;
        }
        if (changed && oldVal !== undefined) {
            text = `${ oldVal }->${ newVal }`;
        }
        return `${ relavantProp.prefix || '' }${ text }${ relavantProp.postfix || '' }`;
    });
    return { anyChange, lineElements };
}

function extractSortedMembers(leaderboardJson) {
    const leaderboard = JSON.parse(leaderboardJson);
    const membersObj = leaderboard.members;
    let members = membersObj && Object.getOwnPropertyNames(membersObj).map(key => membersObj[key]) || [];
    members.sort((m1, m2) => m2.local_score - m1.local_score);
    members.forEach((member, index) => member['position'] = index + 1);
    return members;
}

function createTableLikeString(hangedLineElementsList) {
    return hangedLineElementsList.map((lineElems) => {
        return lineElems.map((elem, i) => {
            const others = hangedLineElementsList.map(lineElems => lineElems[i]);
            const maxLen = Math.max(...others.map(el => el.length));
            return elem.padStart(maxLen)
        }).join('');
    }).join('\n');
}

function createMemberLines(leaderboardJson, oldLeaderboardJson) {
    const newMembers = extractSortedMembers(leaderboardJson);
    const oldMembers = extractSortedMembers(oldLeaderboardJson);
    const changedLineElementsList = newMembers.map(member => {
        const oldMember = oldMembers.find(m => m.id === member.id) || {};
        return createMemberlineElements(member, oldMember)
    }).filter(lineInfo => lineInfo.anyChange).map(lineInfo => lineInfo.lineElements);
    return changedLineElementsList.length && createTableLikeString(changedLineElementsList);
}

module.exports = {
    createMemberLines
}