var Pact = require('pact-consumer-js-dsl');

// Creates a 'global' mock service to be used throughout the tests.
// You can create as many of these as you want, for every different API or logical grouping of functionality
// In this example, only one is needed
module.exports = Pact.mockService({
  consumer: 'pact-example-consumer',
  provider: 'pact-example-provider',
  port: 1234
});