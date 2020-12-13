# Advent of Code 2020 Leaderboard Discord Bot

This is a simple Discord bot written in JavaScript for Node.js that posts to a Discord channel when the stars or the
score on a private leaderboard have changed. The [bot](src/bot.js) will call
on [boardProcessor.js](src/boardProcessor.js) to go through the [fetched](src/aocFetch.js)
leaderboard json files and make a message about changed points, positions, stars and star gain times since the last
fetch of the leaderboard json file. That message - together with a link to the leaderboard page and a short summary - is
then posted to the discord channel by [discordNotifier.js](src/discordNotifier.js).

No fancy integrations, just using Discord client for posting the messages.

# Prerequisites

- Node v10+
- Tested on Windows 10(node v14), [repl.it](https://repl.it/@francisduvivier/aoc-jslb)(node v12), and Rasperry Pi OS (
  raspberry pi zero, node v10)

# How to use

- run `npm install`
- Fill in the `config.json` file with discord bot info and aoc leaderboard info, or put the variables in the environment
  or in a `.env` file.
- Optionally tweak the flags at the top of [boardProcessor.js](src/boardProcessor.js) to your preferences
- Run `npm run start`
- Kill the process if you wanna stop the bot

# Try it out in your Browser now!

I uploaded this project to [repl.it](https://repl.it/) and verified it is working fine there from the browser. You can
run it directly by going here: [https://repl.it/@francisduvivier/aoc-jslb](https://repl.it/@francisduvivier/aoc-jslb).
You need to fork it there and create a .env file in order to pass the config data (required environment variable names
and values are exactly the same as the [config.json](config.json) file). You should know though that saving leaderboard
files to disk is disabled on [repl.it](https://repl.it/) by default. So every time the program is restarted, the whole
leaderboard will be seen as new in the first check.

### Miscellaneous

You can also update the replit file to delete the files on every boot.For that add `onBoot="rm -f data/*.json"` in the `.replit` file.

# License

You can do whatever with this code, but don't sue me.
