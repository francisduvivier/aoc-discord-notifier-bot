type BotConfig = {
    'webhookUrl': string,
    'webhookType': 'DISCORD'|'MSTEAMS',
    'aocCookie': string,
    'leaderboardUrl': string,
}

type BotConfigKey = keyof BotConfig;