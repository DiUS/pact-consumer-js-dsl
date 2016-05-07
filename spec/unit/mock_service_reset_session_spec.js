'use strict';

describe('MockService', function() {

  describe("resetSession", function () {

    var mockService;

    beforeEach(function () {
      mockService = Pact.mockService({
        consumer: 'Consumer',
        provider: 'Provider',
        port: 1234,
        done: function() {}
      });
    });

    describe("when there are no errors", function () {
      it("invokes the passed in callback with null", function (done) {
        spyOn(Pact.MockServiceRequests, 'deleteSession').and.callFake(function( baseUrl, callback){
          callback(null);
        });

        mockService.resetSession(function (error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe("when there is an error setting up the new interactions", function () {
      it("invokes the passed in callback with the error", function (done) {
        spyOn(Pact.MockServiceRequests, 'deleteSession').and.callFake(function( baseUrl, callback){
          callback("Sorry, didn't work");
        });

        mockService.resetSession(function (error) {
          expect(error).toBe("Sorry, didn't work");
          done();
        });
      });
    });
  });
});
