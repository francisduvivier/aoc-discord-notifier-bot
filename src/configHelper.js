const configJson = require('../config.json');

require('dotenv').config();
const configKeys = ['webhookID', 'webhookToken', 'aocCookie', 'leaderboardUrl', 'webhookUrl'];

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
function createConfig(configFromJson = configJson, envObject = process.env) {
    const config = {};
    for (let key of configKeys) {
        if (envObject[key]) {
            config[key] = envObject[key];
            console.log(`Overwriting config [${key}] from environment`)
        } else if (configFromJson[key]) {
            config[key] = configFromJson[key];
        }
        if (config[key] && config[key].indexOf(' ') !== -1) {
            throw new Error(`It seems you have not provided a correct value for [${key}] in the config.json or .env file, we found space character`);
        }
    }
    /**
     * @type {string}
     */
    const webhookUrl = config['webhookUrl'];
    if (webhookUrl && webhookUrl.match('https:\/\/discord.com\/api\/webhooks\/[a-zA-Z0-9]+\/[a-zA-Z0-9_-]+')) {
        if (config['webhookID'] && config['webhookToken']) {
            throw new Error('Config should either have a webookUrl or a (webhookID and webhookToken), but not both')
        }
        const webhookParts = webhookUrl.split('/');
        config['webhookToken'] = webhookParts.pop()
        config['webhookID'] = webhookParts.pop()
    }

    return config;
}

module.exports = {
    createConfig,
    config: createConfig(),
    DUMMY_BOARD,
    DONT_USE_PERMANENT_STORAGE,
    KEEP_ALL_LEADERBOARDS
}