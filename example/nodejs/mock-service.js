var Pact = require('pact-consumer-js-dsl');

module.exports = Pact.mockService({
    consumer: 'pact-example-consumer',
    provider: 'pact-example-provider',
    port: 1234
});