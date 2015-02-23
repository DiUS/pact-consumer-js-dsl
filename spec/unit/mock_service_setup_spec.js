'use strict';

describe('MockService', function() {

  describe("cleanAndSetup", function () {

    var spyContext, mockService;
    var postInteractionError, deleteInteractionsError;

    beforeEach(function () {

      postInteractionError = null;
      deleteInteractionsError = null;

      spyContext = {
        mockServiceDone: function(){},
      };

      spyOn(spyContext, 'mockServiceDone').and.callThrough();

      spyOn(Pact.MockServiceRequests, 'postInteraction').and.callFake(function(interactions, baseUrl, callback){
        callback(postInteractionError);
      });

      spyOn(Pact.MockServiceRequests, 'deleteInteractions').and.callFake(function(baseUrl, callback){
        callback(deleteInteractionsError);
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

        mockService.cleanAndSetup(verifyExpectedCallbacksWereInvoked);
      });
    });

    describe("when there is an error deleting the interactions from the previous test", function () {

      beforeEach(function () {
        deleteInteractionsError = new Error("A fake error deleting the interactions");
      });

      it("invokes the passed in callback with the error", function (done) {
        mockService.cleanAndSetup(function (error) {
          expect(error).toBe(deleteInteractionsError);
          done();
        });
      });

      it("does not invoke the MockService done callback", function (done) {
        mockService.cleanAndSetup(function (error) {
          expect(spyContext.mockServiceDone).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe("when there is an error setting up the new interactions", function () {

      beforeEach(function () {
        postInteractionError = new Error("A fake error setting up the interactions");
      });

      it("invokes the passed in callback with the error", function (done) {
        mockService.cleanAndSetup(function (error) {
          expect(error).toBe(postInteractionError);
          done();
        });
      });

      it("does not invoke the MockService done callback", function (done) {
        mockService.cleanAndSetup(function (error) {
          expect(spyContext.mockServiceDone).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
