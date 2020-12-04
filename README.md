# Advent of Code 2020 Leaderboard Discord Bot

This is a simple Discord bot written in Javascript for Node.js that posts to a Discord channel when the stars or the
score on a private leaderboard have changed.

No fancy integrations, just using Discord client for posting the messages.
# Prerequisites
- Node v10+

# How to use
- run `npm install`
- Fill in the `config.json` file with discord bot info and aoc leaderboard info, or put the variables in the environment
  or in a `.env` file.
- Run `npm run start`
- Kill the process if you wanna stop the bot

# Stuff coming soon

- Nicer looking messages
- More change processing to highlight what's changed
- Nicer logs
- Maybe better run control

# License

You can do whatever with this code, but don't sue me.