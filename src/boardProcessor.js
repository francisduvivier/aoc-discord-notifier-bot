const MAX_MEMBERS_IN_MESSAGE = 40;
const NAME_IN_MESSAGE_CUTOFF = 12;
const FIRST_NAME_IN_SUMMARY_CUTOFF = 10;
const REST_NAME_IN_SUMMARY_CUTOFF = 1;
const MAX_STAR_TIMES_SHOWN = 2;
const SHOW_ONLY_CHANGED_STAR_TIMES = false;
const SHOW_OLD_COMPARISON_VALUES = false;

function getNewStarTimes(member, oldMember) {
    const newMemberStarTimes = getAllStarTimes(member);
    const oldMemberStarTimes = getAllStarTimes(oldMember);
    const newStarTimes = newMemberStarTimes.filter(starTime => oldMemberStarTimes.indexOf(starTime) === -1);
    return newStarTimes;
}

function getAllStarTimes(member) {
    if (!member.completion_day_level) {
        return [];
    }
    const dayIds = Object.getOwnPropertyNames(member.completion_day_level);
    const stars = [];
    for (const dayIndex of dayIds) {
        const dayObj = member.completion_day_level[ dayIndex ];
        const levelIds = Object.getOwnPropertyNames(dayObj);
        for (const levelId of levelIds) {
            stars.push(Number(dayObj[ levelId ].get_star_ts));
        }
    }
    stars.sort((a, b) => a - b);
    return stars;
}

function getStarTimesString(member, oldMember) {
    const starTimes = SHOW_ONLY_CHANGED_STAR_TIMES ? getNewStarTimes(member, oldMember) : getAllStarTimes(member);
    if (starTimes.length > MAX_STAR_TIMES_SHOWN) {
        starTimes.splice(0, starTimes.length - MAX_STAR_TIMES_SHOWN);
    }
    const hourMinutes = (date) => `${String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')}`;
    return `${starTimes.map(ts => hourMinutes(new Date(ts * 1000)))}`;
}

const relevantProps = [
    { prefix: '', key: 'position', postfix: '|', lowIsUp: true, default: 0 },
    { prefix: '', key: 'name', postfix: '|', default: 'null' },
    { prefix: '', key: 'local_score', postfix: 'p|', default: 0 },
    { prefix: '', key: 'stars', postfix: '★|', default: 0 },
];

/**
 * A member object
 * @typedef {{'stars': number, 'name': string, 'local_score': number, 'completion_day_level': [([{get_star_ts: string}])]}} Member
 */

/**
 * @param {Member} member
 * @param {Member|{}} oldMember
 */
function createMemberlineElements(member, oldMember) {
    let anyChange = false;
    const lineElements = relevantProps.map(relevantProp => {
        const key = relevantProp.key;
        const oldVal = oldMember[ key ];
        const newVal = member[ key ];
        const changed = oldVal !== newVal;
        let text = String(newVal || relevantProp.default).substr(0, NAME_IN_MESSAGE_CUTOFF);
        if (changed && (oldVal === undefined || member.stars)) {
            anyChange = true;
        }
        if (changed && oldVal !== undefined) {
            const biggerNumberIcon = key === 'position' ? '↓' : '↑';
            const lowerNumberIcon = key === 'position' ? '↑' : '↓';
            text = `${SHOW_OLD_COMPARISON_VALUES ? oldVal : ''}${
                newVal > oldVal ? biggerNumberIcon : oldVal > newVal ? lowerNumberIcon : ''
            }${newVal}`;
        }
        return `${relevantProp.prefix || ''}${text}${relevantProp.postfix || ''}`;
    });
    lineElements.push(getStarTimesString(member, oldMember));
    return { anyChange, lineElements };
}

function extractSortedMembers(leaderboardJson) {
    const leaderboard = JSON.parse(leaderboardJson);
    const membersObj = leaderboard.members || {};
    let members = Object.getOwnPropertyNames(membersObj).map(key => membersObj[ key ]) || [];
    members.sort((m1, m2) => m2.local_score - m1.local_score);
    members.forEach((member, index) => member[ 'position' ] = index + 1);
    return { map: membersObj, list: members };
}

function createTableLikeString(changedLineElementsList) {
    let tableLikeString = changedLineElementsList.slice(0, MAX_MEMBERS_IN_MESSAGE).map((lineElems) => {
        return lineElems.map((elem, i) => {
            const others = changedLineElementsList.map(lineElems => lineElems[ i ]);
            const maxLen = Math.max(...others.map(el => el.length));
            return ('' + elem.padStart(maxLen, '\u00A0')).replace(/\s/g, '\u00A0');
        }).join('');
    }).join('\n');
    if (changedLineElementsList.length > MAX_MEMBERS_IN_MESSAGE) {
        tableLikeString += `\nAnd ${changedLineElementsList.length - MAX_MEMBERS_IN_MESSAGE} more changes!`;
    }
    return tableLikeString;
}

function createMemberLines(leaderboardJson, oldLeaderboardJson) {
    const { list: newMembers } = extractSortedMembers(leaderboardJson);
    const { map: oldMemberMap } = extractSortedMembers(oldLeaderboardJson);
    const changedLineElementsList = newMembers.map(member => {
        const oldMember = oldMemberMap[ member.id ] || {};
        return createMemberlineElements(member, oldMember);
    }).filter(lineInfo => lineInfo.anyChange).map(lineInfo => lineInfo.lineElements);
    return changedLineElementsList.length && createTableLikeString(changedLineElementsList);
}

function createMemberSummary(newMember, oldMember) {
    const addedStars = getNewStarTimes(newMember, oldMember);
    const splitName = ('' + newMember.name || 'Mister Nameless').split(' ');
    const firstName = splitName[ 0 ].substr(0, FIRST_NAME_IN_SUMMARY_CUTOFF);
    const restName = splitName.slice(1).join(' ').substr(0, REST_NAME_IN_SUMMARY_CUTOFF);
    const shortName = [ firstName, restName ].join(' ');
    if (!(oldMember.position <= newMember.position)) {
        return `**${shortName}**: ↑**${newMember.position}**`;
    } else if (addedStars.length) {
        return `**${shortName}**: +**${addedStars.length}**★`;
    }
    return '';
}

function createSummary(leaderboardJson, oldLeaderboardJson) {
    const { list: newMembers } = extractSortedMembers(leaderboardJson);
    const { map: oldMemberMap } = extractSortedMembers(oldLeaderboardJson);
    const memberSummaries = newMembers.map(member => {
        const oldMember = oldMemberMap[ member.id ] || {};
        return createMemberSummary(member, oldMember);
    });
    const improvedMembers = memberSummaries.filter(summary => summary);
    if (improvedMembers.length > 3) {
        const removedMembers = improvedMembers.splice(3);
        return `${improvedMembers.join(', ')} and ${removedMembers.length} more updates`;
    } else {
        return improvedMembers.join(', ');
    }
}

module.exports = {
    createMemberLines,
    createSummary
};