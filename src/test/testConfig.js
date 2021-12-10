const { assert } = require("console")
process.env['webhookID'] = ''
process.env['webhookToken'] = ''
process.env['webhookUrl'] = 'https://discord.com/api/webhooks/918987678614192169/QrQDBqQU01qthGJl484_w74zLz-BmO-ySyxoxBrZ9L4BCowwbQqM4anaBDddp7B0aDLY'
const { config } = require("../configHelper")
assert(config['webhookID'] == '918987678614192169')
assert(config['webhookToken'] == 'QrQDBqQU01qthGJl484_w74zLz-BmO-ySyxoxBrZ9L4BCowwbQqM4anaBDddp7B0aDLY')
console.log('Tests Done')