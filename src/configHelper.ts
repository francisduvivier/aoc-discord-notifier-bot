import * as configFromJson from "../config.json";

require('dotenv').config();
const configKeys = ['webhookID', 'webhookToken', 'aocCookie', 'leaderboardUrl'] as const;
export const config = createConfig();
type keys = typeof configKeys[number];
export type Config = {
    [key in keys]: string;
};

function createConfig() {
    const config = {} as Config;
    for (let key of configKeys) {
        if (process.env[key]) {
            config[key] = process.env[key];
            console.log(`Overwriting config [${key}] from environment`)
        } else {
            config[key] = configFromJson[key];
        }
        if (config[key]?.indexOf(' ') !== -1) {
            console.log(`It seems you have not provided a correct value for [${key}] in the config.json or .env file, we found space character`);
        }
    }
    return config;
}
