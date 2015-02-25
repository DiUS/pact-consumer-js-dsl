'use strict';

describe('MockService', function() {

  describe("setup", function () {

    var spyContext, mockService;
    var putInteractionsError;

    beforeEach(function () {

      putInteractionsError = null;

      spyContext = {
        mockServiceDone: function(){},
      };

      spyOn(spyContext, 'mockServiceDone').and.callThrough();

      spyOn(Pact.MockServiceRequests, 'putInteractions').and.callFake(function(interactions, baseUrl, callback){
        callback(putInteractionsError);
      });

      mockService = Pact.mockService({
            consumer: 'Consumer',
            provider: 'Provider',
            port: 1234,
            done: spyContext.mockServiceDone
          });

      mockService.uponReceiving("a request").withRequest('get', '/foo').willRespondWith(200);
    });

    describe("when there are no errors", function () {
      it("invokes the passed in callback with null", function (done) {
        function verifyExpectedCallbacksWereInvoked(error) {
          expect(error).toBe(null);
          expect(spyContext.mockServiceDone).not.toHaveBeenCalled();
          done();
        }

        mockService.setup(verifyExpectedCallbacksWereInvoked);
      });
    });

    describe("when there is an error setting up the new interactions", function () {

      beforeEach(function () {
        putInteractionsError = new Error("A fake error setting up the interactions");
      });

      it("invokes the passed in callback with the error", function (done) {
        mockService.setup(function (error) {
          expect(error).toBe(putInteractionsError);
          done();
        });
      });

      it("does not invoke the MockService done callback", function (done) {
        mockService.setup(function (error) {
          expect(spyContext.mockServiceDone).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
