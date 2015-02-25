'use strict';

describe('MockService', function() {

  describe("run", function () {

    var spyContext, mockService;
    var verificationError, putInteractionsError, deleteInteractionsError, postPactError;

    beforeEach(function () {

      putInteractionsError = null;
      deleteInteractionsError = null;
      verificationError = null;
      postPactError = null;

      spyContext = {
        mockServiceDone: function(){},
      };

      spyOn(spyContext, 'mockServiceDone').and.callThrough();

      spyOn(Pact.MockServiceRequests, 'putInteractions').and.callFake(function(interactions, baseUrl, callback){
        callback(putInteractionsError);
      });

      spyOn(Pact.MockServiceRequests, 'getVerification').and.callFake(function(baseUrl, callback){
        callback(verificationError);
      });

      spyOn(Pact.MockServiceRequests, 'postPact').and.callFake(function(pactDetails, baseUrl, callback){
        callback(postPactError);
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
      it("invokes the done callback with null", function (done) {
        function verifyExpectedCallbacksWereInvoked() {
          expect(spyContext.mockServiceDone).toHaveBeenCalledWith(null);
          done();
        }

        mockService.run(verifyExpectedCallbacksWereInvoked, function(runDone){
          runDone();
        })
      });
    });

    describe("when an error occurs while setting up the interactions", function () {

      beforeEach(function () {
        putInteractionsError = new Error('A fake error while setting up interactions');
      });

      it("invokes the done callback with an error", function (done) {
        function verifyExpectedCallbacksWereInvoked() {
          expect(spyContext.mockServiceDone).toHaveBeenCalledWith(putInteractionsError);
          done();
        }

        mockService.run(verifyExpectedCallbacksWereInvoked, function(runDone){
          runDone();
        })
      });
    });

    describe("when an error occurs while verifying the interactions", function () {

      beforeEach(function () {
        verificationError = new Error('A fake error while verifying');
      });

      it("invokes the done callback with an error", function (done) {
        function verifyExpectedCallbacksWereInvoked() {
          expect(spyContext.mockServiceDone).toHaveBeenCalledWith(verificationError);
          done();
        }

        mockService.run(verifyExpectedCallbacksWereInvoked, function(runDone){
          runDone();
        })
      });
    });

    describe("when an error occurs while writing the pact file", function () {

      beforeEach(function () {
        postPactError = new Error('A fake error while writing the pact');
      });

      it("invokes the done callback with an error", function (done) {
        function verifyExpectedCallbacksWereInvoked() {
          expect(spyContext.mockServiceDone).toHaveBeenCalledWith(postPactError);
          done();
        }

        mockService.run(verifyExpectedCallbacksWereInvoked, function(runDone){
          runDone();
        })
      });
    });
  });
});
