module.exports = function () {

  var path = require('path');

  // Retrieve the mock service needed for our tests
  var mockService = require(path.resolve(__dirname, 'mock-service.js'));

  // Setup interaction when calling the root url with GET
  mockService
    .given('the root url')
    .uponReceiving('a GET request for all data')
    .withRequest('get', '/')
    .willRespondWith({
      status: 200,
      body: [
        {id: 092834, text: 'random text here.'},
        {id: 023453, text: 'more text'}
      ]
    });

  // Setup interaction when calling the root url with POST
  mockService
    .given('the root url')
    .uponReceiving('a POST request with json data')
    .withRequest('post', '/', null, { text: 'different text' })
    .willRespondWith({
      status: 200,
      body: Math.floor(Math.random() * 1000000) // Random 6 digit ID
    });

  mockService.setup(function (error) {
    if (error) {
      console.warn('Pact wasn\'t able set up the interactions: \n' + e);
    }
  }); // Cleans out old interactions and sets up new ones
};