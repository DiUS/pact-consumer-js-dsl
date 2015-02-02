module.exports = function () {

    var path = require('path');
    var mockService = require(path.resolve(__dirname, 'mock-service.js'));

    try {
        mockService.verify(); // Verify that all the mock calls has been made, throw error if not
        try {
            mockService.write(); // If verification worked, write the files to specified directory
        } catch(e) {
            console.warn('Pact wasn\'t able to write the files: \n'+ e);
        }
    } catch(e) {
        console.warn('Pact wasn\'t able to verify the interactions: \n'+ e);
    }
};