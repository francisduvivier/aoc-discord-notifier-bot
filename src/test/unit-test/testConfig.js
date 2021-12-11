const validWebHookUrl = 'https://discord.com/api/webhooks/someHookID6/some_Hook-Token9';
describe('Test configHelper', function () {

    process.env['webhookUrl'] = 'empty'
    const { createConfig } = require("../../configHelper")
    it('should extract the ID and token from a webhookURL', function () {
        const config = createConfig({
            webhookUrl: validWebHookUrl
        }, {})
        expect(config.webhookID).toEqual('someHookID6');
        expect(config.webhookToken).toEqual('some_Hook-Token9')
    });
    it('should extract the ID and token from a webhookURL', function () {
        const config = createConfig({
            webhookID: 'jos',
            webhookToken: 'jaak'
        }, {})
        expect(config.webhookID).toEqual('jos');
        expect(config.webhookToken).toEqual('jaak')
    });
    it('should throw an error on a bad config', function () {
        expect(() => createConfig({ 'webhookUrl': ' jos jaak' }, {})).toThrow()
    })
    it('should throw an error if bot webhook and id and token are given', function () {
        expect(() => createConfig({
            webhookUrl: validWebHookUrl,
            webhookID: 'jos',
            webhookToken: 'jaak'
        }, {})).toThrow()
    })
});