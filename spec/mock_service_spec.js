describe('MockService', function() {

  var baseUrl = 'http://localhost:1234',
    mockService;

  beforeEach(function() {
    mockService = Pact.mockService({
      consumer: 'Consumer',
      provider: 'Provider',
      port: 1234
    });
  });

  describe('a successful match using argument lists', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/thing', false);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send('body');
      return xhr;
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
        var response = doHttpCall();

        expect(JSON.parse(response.responseText)).toEqual({
          reply: 'Hello'
        });
        expect(response.status).toEqual(201);
        expect(response.getResponseHeader('Content-Type')).toEqual('application/json');
        runComplete(done);
      });

    });
  });

  describe('a successful match using hash arguments', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/thing?message=hello', false);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send('body');
      return xhr;
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
        var response = doHttpCall();

        expect(JSON.parse(response.responseText)).toEqual({
          reply: 'Hello'
        });
        expect(response.status).toEqual(201);
        expect(response.getResponseHeader('Content-Type')).toEqual('application/json');
        runComplete(done);
      });

    });
  });

  describe('a successful match using a query hash', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/thing?lastName=Smith&firstName=Mary+Jane', false);
      xhr.send();
      return xhr;
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
        var response = doHttpCall();

        expect(response.status).toEqual(201);
        runComplete(done);
      });
    });
  });

  describe('multiple interactions mocked at the same time', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', baseUrl + '/thing', false);
      xhr.send('body');
      return xhr;
    };

    var doDifferentHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', baseUrl + '/different-thing', false);
      xhr.send('body');
      return xhr;
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
        var response = doHttpCall();
        var differentResponse = doDifferentHttpCall();

        expect(response.responseText).toEqual('thing response');
        expect(differentResponse.responseText).toEqual('different thing response');
        runComplete(done);
      });
    });
  });

  describe('verifying a successful match', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/thing', false);
      xhr.send();
      return xhr;
    };

    it('does not raise an error', function(done) {
      mockService
        .uponReceiving('a response that will be verified')
        .withRequest('post', '/thing')
        .willRespondWith(201);

      mockService.run(function(runComplete) {
        var response = doHttpCall();

        expect(response.status).toEqual(201);
        runComplete(done);
      });

    });
  });

  describe('verifying an unsuccessful match', function() {

    var doHttpCall = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/wrongThing', false);
      xhr.send();
      return xhr;
    };

    it('raises an error', function(done) {
      mockService
        .uponReceiving('a response that will be verified')
        .withRequest('post', '/thing')
        .willRespondWith(201);

      mockService.run(function(runComplete) {
        var response = doHttpCall();
        expect(response.status).toEqual(500);

        runComplete(function(error) {
          expect(error).toMatch(/verification failed/)
          done();
        });
      });
    });
  });
});
