const configFromJson = require('../config.json');

require('dotenv').config();
const configKeys = [ 'webhookID', 'webhookToken', 'aocCookie', 'leaderboardUrl' ];

const config = createConfig();

const DUMMY_BOARD = process.env.DUMMY_BOARD === 'true';
const DONT_USE_PERMANENT_STORAGE = process.env.DONT_USE_PERMANENT_STORAGE === 'true';
const KEEP_ALL_LEADERBOARDS = process.env.KEEP_ALL_LEADERBOARDS === 'true';

/**
 * @return {{
 *     'webhookID': string,
 *     'webhookToken': string,
 *     'aocCookie': string,
 *     'leaderboardUrl': string
 * }}
 */
function createConfig() {
    const config = {};
    for (let key of configKeys) {
        if (process.env[key]) {
            config[key] = process.env[key];
            console.log(`Overwriting config [${ key }] from environment`)
        } else {
            config[key] = configFromJson[key];
        }
        if (config[key].indexOf(' ') !== -1) {
            console.log(`It seems you have not provided a correct value for [${ key }] in the config.json or .env file, we found space character`);
        }
    }
    return config;
}

module.exports = {
    config,
    DUMMY_BOARD,
    DONT_USE_PERMANENT_STORAGE,
    KEEP_ALL_LEADERBOARDS
}