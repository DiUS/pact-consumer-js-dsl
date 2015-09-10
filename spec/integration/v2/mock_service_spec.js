'use strict';

describe('MockService', function() {
  var doneCallback, mockService;

  beforeEach(function() {

    doneCallback = jasmine.createSpy('doneCallback').and.callFake(function (error) {
      expect(error).toBe(null);
    });

    mockService = Pact.mockService({
      consumer: 'Consumer',
      provider: 'Provider',
      port: 1234,
      done: doneCallback
    });
  });

  describe("a successful match using Pact Matchers", function() {

    describe("with an argument list", function() {

        var doHttpCall = function(callback) {
          specHelper.makeRequest({
            body: 'body',
            headers: {
                'Content-Type': 'text/plain'
            },
            method: 'POST',
            path: '/thing'
          }, callback);
        };

      it('returns the mocked response', function(done) {

        mockService
          .uponReceiving('a request with Pact.Match using argument list')
          .withRequest('post', '/thing', {
            'Content-Type': 'text/plain'
          }, 'body')
          .willRespondWith(201, {
            'Content-Type': 'application/json'
          }, {
            reply: Pact.Match.somethingLike('Hello'),
            language: Pact.Match.term({generate: 'English', matcher: '\\w+'})
          });

        mockService.run(done, function(runComplete) {
          doHttpCall(function (error, response) {
            expect(error).toBe(null, 'error');
            expect(JSON.parse(response.responseText)).toEqual({reply: 'Hello', language: 'English'}, 'responseText');
            expect(response.status).toEqual(201, 'status');
            expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
            runComplete();
          });
        });
      });
    });


    describe("with an argument hash", function() {
        var doHttpCall = function(callback) {
           specHelper.makeRequest({body: 'body',
              headers: {
                'Content-Type': 'text/plain'
              },
              method: 'POST',
              path: '/thing?message=gutentag&language=german'
           }, callback);
        };

      it('returns the mocked response', function(done) {
        mockService
          .uponReceiving('a request with a Pact.Match')
          .withRequest({
            method: 'post',
            path: '/thing',
            query: {
              message: Pact.Match.term({generate: 'ciao', matcher: "\\w+"}),
              language: Pact.Match.somethingLike('italian')
            },
            headers: {
              'Content-Type': 'text/plain'
            },
            body: 'body'
          })
          .willRespondWith({
            status: 201,
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              reply: Pact.Match.somethingLike('Hello'),
              language: Pact.Match.term({generate: 'English', matcher: '\\w+'})
            }
          });

        mockService.run(done, function(runComplete) {
          doHttpCall(function (error, response) {
            expect(error).toBe(null, 'error');
            expect(JSON.parse(response.responseText)).toEqual({reply: 'Hello', language: 'English'}, 'responseText');
            expect(response.status).toEqual(201, 'status');
            expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
            runComplete();
          });
        });
      });
    });
  });

});
