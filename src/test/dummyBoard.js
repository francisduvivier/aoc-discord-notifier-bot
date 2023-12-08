let counter = 0;

function getDummyBoard() {
    const boards = [ getBoard1(), getBoard2() ];
    return JSON.stringify(boards[ counter++ % boards.length ]);
}

function getBoard2() {
    return {
        'owner_id': '12345',
        'members': {
            '12345': {
                'local_score': 12,
                'completion_day_level': {
                    '1': {
                        '2': { 'get_star_ts': '1607270458' },
                        '1': { 'get_star_ts': '1607270297' }
                    },
                    '2': { '2': { 'get_star_ts': '1607272906' }, '1': { 'get_star_ts': '1607271926' } },
                    '4': { '2': { 'get_star_ts': '1607374289' }, '1': { 'get_star_ts': '1607363869' } }
                },
                'stars': 6,
                'last_star_ts': '1607374289',
                'global_score': 0,
                'name': 'Player Two',
                'id': '12345'
            },
            '212345': {
                'local_score': 151,
                'completion_day_level': {
                    '11': {
                        '1': { 'get_star_ts': '1607708355' },
                        '2': { 'get_star_ts': '1607708818' }
                    },
                    '12': { '1': { 'get_star_ts': '1607799342' }, '2': { 'get_star_ts': '1607799728' } },
                    '6': { '1': { 'get_star_ts': '1607232656' }, '2': { 'get_star_ts': '1607233100' } },
                    '7': { '1': { 'get_star_ts': '1607342579' }, '2': { 'get_star_ts': '1607343198' } },
                    '1': { '2': { 'get_star_ts': '1606801567' }, '1': { 'get_star_ts': '1606801381' } },
                    '10': { '1': { 'get_star_ts': '1607601697' }, '2': { 'get_star_ts': '1607603598' } },
                    '4': { '1': { 'get_star_ts': '1607059037' }, '2': { 'get_star_ts': '1607060508' } },
                    '3': { '1': { 'get_star_ts': '1606974786' }, '2': { 'get_star_ts': '1606975323' } },
                    '5': { '2': { 'get_star_ts': '1607147797' }, '1': { 'get_star_ts': '1607146766' } },
                    '9': { '1': { 'get_star_ts': '1607513665' }, '2': { 'get_star_ts': '1607514105' } },
                    '8': { '1': { 'get_star_ts': '1607427166' }, '2': { 'get_star_ts': '1607427888' } },
                    '2': { '1': { 'get_star_ts': '1606887022' }, '2': { 'get_star_ts': '1606887576' } }
                },
                'last_star_ts': '1607799728',
                'stars': 24,
                'name': 'Francis Duvivier',
                'global_score': 0,
                'id': '212345'
            },
            '312345': {
                'name': 'Joske',
                'id': '312345'
            },
        }, 'event': '2020'
    };
}

function getBoard1() {
    const firstBoardCopy = JSON.parse(JSON.stringify(getBoard2()));
    delete firstBoardCopy.members[ '12345' ];
    firstBoardCopy.members[ '212345' ].stars -= 2;
    firstBoardCopy.members[ '212345' ].local_score -= 21;
    delete firstBoardCopy.members[ '212345' ].completion_day_level[ '11' ];
    delete firstBoardCopy.members[ '212345' ].completion_day_level[ '12' ];
    return firstBoardCopy;
}

module.exports = {
    getDummyBoard
};