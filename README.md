# Advent of Code 2020 Leaderboard Discord Bot

This is a simple Discord bot written in JavaScript for Node.js that posts to a Discord channel when the stars or the
score on a private leaderboard have changed.

No fancy integrations, just using Discord client for posting the messages.
# Prerequisites
- Node v10+
- Tested on Windows 10(node v14), [repl.it](https://repl.it/@francisduvivier/aoc-jslb)(node v12), and Rasperry Pi OS (raspberry pi zero, node v10)

# How to use
- run `npm install`
- Fill in the `config.json` file with discord bot info and aoc leaderboard info, or put the variables in the environment
  or in a `.env` file.
- Run `npm run start`
- Kill the process if you wanna stop the bot

# Try it out in your Browser now!
I uploaded this project to repl.it and verified it is working fine there from the browser. You can run it directly by going here: [https://repl.it/@francisduvivier/aoc-jslb](https://repl.it/@francisduvivier/aoc-jslb). You need to fork it there and create a .env file in order to pass the config data (required environment variable names and values are exactly the same as the `config.json` file. You should know though that your leaderboard will be stored in a file which is as public as your replit fork. Check `getNewLeaderBoard` in `src/aocFetch.js` to change this.

# Stuff coming soon

- Nicer looking messages
- More change processing to highlight what's changed
- Maybe better run control

# License

You can do whatever with this code, but don't sue me.
