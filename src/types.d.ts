type BotConfig = {
    'webhookUrl': string,
    'aocCookie': string,
    'leaderboardUrl': string,
    'webhookType': string,
}

type BotConfigKey = keyof BotConfig;