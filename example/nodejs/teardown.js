module.exports = function () {

  var path = require('path');

  // Retrieve the mock service
  var mockService = require(path.resolve(__dirname, 'mock-service.js'));

  // Verify that all the mock calls has been made that was specified in setup.js
  // Throw error if tests didn't call the service exactly the same way as specified
  // Then write out pact files
  mockService.verifyAndWrite(function (error) {
    if (error) {
      console.warn('Pact wasn\'t able to verify the interactions: \n' + e);
    } else {
      console.log('Pact verified and written.');
    }
  });
};