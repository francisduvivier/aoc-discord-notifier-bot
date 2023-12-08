type BotConfig = {
    'webhookUrl': string,
    'webhookType': string,
    'aocCookie': string,
    'leaderboardUrl': string,
}

type BotConfigKey = keyof BotConfig;