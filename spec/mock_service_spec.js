'use strict';

describe('MockService', function() {
  var baseUrl, isNodeJs, mockService, Pact;

  baseUrl = 'http://localhost:1234';
  isNodeJs = typeof module === 'object' && typeof module.exports === 'object';
  Pact = (isNodeJs) ? require('../dist/pact-consumer-js-dsl.js') : window.Pact;

  var makeRequestForNode = function (options, callback) {
    var request = require('request');
    var requestOptions = {
      body: options.body,
      headers: options.headers,
      method: options.method,
      url: baseUrl + options.path
    };
    request(requestOptions, function (error, response, body) {
      if (error) {
        callback(new Error('Error calling ' + options.path + ' - ' + err.message));
      } else {
        callback(null, {
          getResponseHeader: function (header) {
            return response.headers[header.toLowerCase()];
          },
          responseText: body,
          status: response.statusCode
        });
      }
    });
  };

  var makeRequestForBrowser = function (options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(event) {
      callback(null, event.target);
    };
    xhr.onerror = function() {
      callback(new Error('Error calling ' + options.path));
    };
    xhr.open(options.method, baseUrl + options.path, false);

    if (options.headers) {
      Object.keys(options.headers).forEach(function (header) {
        xhr.setRequestHeader(header, options.headers[header]);
      });
    }

    xhr.send(options.body);
  };

  var makeRequest = (isNodeJs) ? makeRequestForNode : makeRequestForBrowser;

  beforeEach(function() {
    mockService = Pact.mockService({
      consumer: 'Consumer',
      provider: 'Provider',
      port: 1234
    });
  });

  describe('a successful match using argument lists', function() {

    var doHttpCall = function(callback) {
      return makeRequest({
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
        .uponReceiving('a request for hello')
        .withRequest('post', '/thing', {
          'Content-Type': 'text/plain'
        }, 'body')
        .willRespondWith(201, {
          'Content-Type': 'application/json'
        }, {
          reply: 'Hello'
        });

      mockService.run(function(runComplete) {
        doHttpCall(function (error, response) {
          expect(error).toBe(null, 'error');
          expect(JSON.parse(response.responseText)).toEqual({reply: 'Hello'}, 'responseText');
          expect(response.status).toEqual(201, 'status');
          expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
          runComplete(done);
        });
      });

    });
  });

  describe('a successful match using hash arguments', function() {

    var doHttpCall = function(callback) {
      makeRequest({
        body: 'body',
        headers: {
          'Content-Type': 'text/plain'
        },
        method: 'POST',
        path: '/thing?message=hello'
      }, callback);
    };

    it('returns the mocked response', function(done) {
      mockService
        .uponReceiving('another request for hello')
        .withRequest({
          method: 'post',
          path: '/thing',
          query: 'message=hello',
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
            reply: 'Hello'
          }
        });

      mockService.run(function(runComplete) {
        doHttpCall(function (error, response) {
          expect(error).toBe(null, 'error');
          expect(JSON.parse(response.responseText)).toEqual({reply: 'Hello'}, 'responseText');
          expect(response.status).toEqual(201, 'status');
          expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
          runComplete(done);
        });
      });

    });
  });

  describe('a successful match using a query hash', function() {

    var doHttpCall = function(callback) {
      makeRequest({
        method: 'POST',
        path: '/thing?lastName=Smith&firstName=Mary+Jane'
      }, callback);
    };

    it('returns the mocked response', function(done) {
      mockService
        .uponReceiving('a request with a query hash')
        .withRequest({
          method: 'post',
          path: '/thing',
          query: {
            firstName: 'Mary Jane',
            lastName: 'Smith'
          } //Don't URL encode
        })
        .willRespondWith(201);

      mockService.run(function(runComplete) {
        doHttpCall(function (error, response) {
          expect(error).toBe(null, 'error');
          expect(response.status).toEqual(201, 'status');
          runComplete(done);
        });
      });
    });
  });

  describe('multiple interactions mocked at the same time', function() {

    var doHttpCall = function(callback) {
      makeRequest({
        body: 'body',
        method: 'GET',
        path: '/thing'
      }, callback);
    };

    var doDifferentHttpCall = function(callback) {
      makeRequest({
        body: 'body',
        method: 'GET',
        path: '/different-thing'
      }, callback);
    };

    it('returns the correct mocked response', function(done) {
      mockService
        .uponReceiving('a request for a thing')
        .withRequest('get', '/thing')
        .willRespondWith(200, {}, 'thing response');

      mockService
        .uponReceiving('a different request for a thing')
        .withRequest('get', '/different-thing')
        .willRespondWith(200, {}, 'different thing response');

      mockService.run(function(runComplete) {
        doHttpCall(function (responseError, response) {
          doDifferentHttpCall(function (differentResponseError, differentResponse) {
            expect(responseError).toBe(null, 'responseError');
            expect(differentResponseError).toBe(null, 'differentResponseError');
            expect(response.responseText).toEqual('thing response', 'response.responseText');
            expect(differentResponse.responseText).toEqual('different thing response', 'differentResponse.responseText');
            runComplete(done);
          });
        });
      });
    });
  });

  describe('verifying a successful match', function() {

    var doHttpCall = function(callback) {
      makeRequest({
        method: 'POST',
        path: '/thing'
      }, callback);
    };

    it('does not raise an error', function(done) {
      mockService
        .uponReceiving('a response that will be verified')
        .withRequest('post', '/thing')
        .willRespondWith(201);

      mockService.run(function(runComplete) {
        doHttpCall(function (error, response) {
          expect(error).toBe(null, 'error');
          expect(response.status).toEqual(201, 'status');
          runComplete(done);
        });
      });
    });
  });

  describe('verifying an unsuccessful match', function() {

    var doHttpCall = function(callback) {
      makeRequest({
        method: 'POST',
        path: '/wrongThing'
      }, callback);
    };

    it('raises an error', function(done) {
      mockService
        .uponReceiving('a response that will be verified')
        .withRequest('post', '/thing')
        .willRespondWith(201);

      mockService.run(function(runComplete) {
        doHttpCall(function (error, response) {
          expect(error).toBe(null, 'error');
          expect(response.status).toEqual(500, 'status');
          runComplete(function(pactError) {
            expect(pactError).toMatch(/verification failed/, 'pactError');
            done();
          });
        });
      });
    });
  });
});
