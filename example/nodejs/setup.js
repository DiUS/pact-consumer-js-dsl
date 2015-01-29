module.exports = function () {

    var path = require('path');
    var provider = require(path.resolve(__dirname, 'provider.js'));

    provider.clean(); // Remove all interactions first

    provider // Setup interaction when calling the root url with GET
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

    provider // Setup interaction when calling the root url with POST
        .given('the root url')
        .uponReceiving('a POST request with json data')
        .withRequest('post', '/', null, { text: 'different text' })
        .willRespondWith({
            status: 200,
            body: Math.floor(Math.random() * 1000000) // Random 6 digit ID
        });
};