function getNewStarTimes(member, oldMember) {
    const changedStars = [];
    const dayIds = Object.getOwnPropertyNames(member.completion_day_level);
    for (const dayIndex of dayIds) {
        const dayObj = member.completion_day_level[dayIndex];
        const levelIds = Object.getOwnPropertyNames(dayObj);
        for (const levelId of levelIds) {
            if (!oldMember || !oldMember.completion_day_level || !oldMember.completion_day_level[dayIndex] || !oldMember.completion_day_level[dayIndex][levelId]) {
                changedStars.push(dayObj[levelId].get_star_ts)
            }
        }
    }
    changedStars.sort((a, b) => a - b)
    return changedStars;
}

function getNewStarTimesString(member, oldMember) {
    const changedStars = getNewStarTimes(member, oldMember);
    if (changedStars.length > 2) {
        changedStars.splice(0, changedStars.length - 2)
    }
    const hourMinutes = (date) => `${ String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') }`
    return `${ changedStars.map(ts => hourMinutes(new Date(ts * 1000))) }`;
}

const relevantProps = [
    { prefix: '', key: 'position', postfix: '|' },
    { prefix: '', key: 'name', postfix: '|' },
    { prefix: '', key: 'local_score', postfix: 'p|' },
    { prefix: '', key: 'stars', postfix: '*|' },
]

/**
 * A member object
 * @typedef {{"stars": number, "name": string, "local_score": number, "completion_day_level": [([{get_star_ts: string}])]}} Member
 */
/**
 * @param {Member} member
 * @param {Member|{}} oldMember
 */
function createMemberlineElements(member, oldMember) {
    let anyChange = false;
    const lineElements = relevantProps.map(relavantProp => {
        const key = relavantProp.key;
        const oldVal = oldMember[key];
        const newVal = member[key];
        const changed = oldVal !== newVal;
        let text = String(newVal).substr(0, 15);
        if (changed) {
            anyChange = true;
        }
        if (changed && oldVal !== undefined) {
            text = `${ oldVal }->${ newVal }`;
        }
        return `${ relavantProp.prefix || '' }${ text }${ relavantProp.postfix || '' }`;
    });
    lineElements.push(getNewStarTimesString(member, oldMember));
    return { anyChange, lineElements };
}

function extractSortedMembers(leaderboardJson) {
    const leaderboard = JSON.parse(leaderboardJson);
    const membersObj = leaderboard.members || {};
    let members = Object.getOwnPropertyNames(membersObj).map(key => membersObj[key]) || [];
    members.sort((m1, m2) => m2.local_score - m1.local_score);
    members.forEach((member, index) => member['position'] = index + 1);
    return { map: membersObj, list: members };
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
    const { list: newMembers } = extractSortedMembers(leaderboardJson);
    const { map: oldMemberMap } = extractSortedMembers(oldLeaderboardJson);
    const changedLineElementsList = newMembers.map(member => {
        const oldMember = oldMemberMap[member.id] || {};
        return createMemberlineElements(member, oldMember)
    }).filter(lineInfo => lineInfo.anyChange).map(lineInfo => lineInfo.lineElements);
    return changedLineElementsList.length && createTableLikeString(changedLineElementsList);
}

function createMemberSummary(newMember, oldMember) {
    const addedStars = getNewStarTimes(newMember, oldMember)
    const splitName = ('' + newMember.name || 'Mister Nameless').split(' ');
    const shortName = splitName[0].substr(0, 10) + (splitName[1] && (' ' + splitName[1][0]) || '');
    if (!(oldMember.position <= newMember.position)) {
        return `**${ shortName }** rose to position **${ newMember.position }**`
    } else if (addedStars.length) {
        return `**${ shortName }** gained **${ addedStars.length }** *`
    }
    return '';
}

function createSummary(leaderboardJson, oldLeaderboardJson) {
    const { list: newMembers } = extractSortedMembers(leaderboardJson);
    const { map: oldMemberMap } = extractSortedMembers(oldLeaderboardJson);
    const memberSummaries = newMembers.map(member => {
        const oldMember = oldMemberMap[member.id] || {};
        return createMemberSummary(member, oldMember)
    })
    const improvedMembers = memberSummaries.filter(summary => summary);
    if (improvedMembers.length > 3) {
        const removedMembers = improvedMembers.splice(3);
        return `${ improvedMembers.join(', ') } and ${ removedMembers.length } more updates`
    } else {
        return improvedMembers.join(', ')
    }
}

module.exports = {
    createMemberLines,
    createSummary
}