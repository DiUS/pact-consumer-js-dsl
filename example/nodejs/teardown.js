module.exports = function () {

    var path = require('path');

    // Retrieve the mock service
    var mockService = require(path.resolve(__dirname, 'mock-service.js'));

    try {
        // Verify that all the mock calls has been made that was specified in setup.js
        // Throw error if tests didn't call the service exactly the same way as specified
        mockService.verify();
        try {
            // If verification worked, write the files to specified directory
            // The files written are based on the 'consumer' property of the mockService
            mockService.write();
        } catch(e) {
            console.warn('Pact wasn\'t able to write the files: \n'+ e);
        }
    } catch(e) {
        console.warn('Pact wasn\'t able to verify the interactions: \n'+ e);
    }
};