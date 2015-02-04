'use strict';

var Pact = Pact || {};
Pact.IsNodeJs = typeof module === 'object' && typeof module.exports === 'object';

if (Pact.IsNodeJs) {
  module.exports = Pact;
}

(function() {

  // consumerName, providerName, port, pactDir
  this.mockService = function(opts) {
    return Pact.MockService.create(opts);
  };

  this.givenInteraction = function(providerState) {
    return Pact.Interaction.create().given(providerState);
  };

  this.receivingInteraction = function(description) {
    return Pact.Interaction.create().uponReceiving(description);
  };

}).apply(Pact);

Pact.Interaction = Pact.Interaction || {};

(function() {

  this.create = function() {
    return {
      providerState: null,
      description: '',
      request: {},
      response: {},

      given: function(providerState) {
        this.provider_state = providerState;
        return this;
      },

      uponReceiving: function(description) {
        this.description = description;
        return this;
      },

      withRequest: function(firstParameter, path, headers, body) {

        if (typeof(firstParameter) === 'object') {
          this.request.method = firstParameter.method.toLowerCase();
          this.request.path = firstParameter.path;
          this.request.query = firstParameter.query;
          this.request.headers = firstParameter.headers;
          this.request.body = firstParameter.body;
        } else {
          this.request.method = firstParameter.toLowerCase();
          this.request.path = path;
          this.request.headers = headers;
          this.request.body = body;
        }

        if (!this.request.method || !this.request.path) {
          throw 'pact-consumer-js-dsl\'s "withRequest" function requires "method" and "path" parameters';
        }

        return this;
      },

      willRespondWith: function(firstParameter, headers, body) {

        if (typeof(firstParameter) === 'object') {
          this.response.status = firstParameter.status;
          this.response.headers = firstParameter.headers;
          this.response.body = firstParameter.body;
        } else {
          this.response.status = firstParameter;
          this.response.headers = headers;
          this.response.body = body;
        }

        if (!this.response.status) {
          throw 'pact-consumer-js-dsl\'s "willRespondWith" function requires "status" parameter';
        }

        return this;
      }
    };
  };

}).apply(Pact.Interaction);

Pact.Http = Pact.Http || {};

(function() {
  var makeRequestForNode = function(method, url, body, callback) {
    var http = require('http');
    var parse = require('url').parse;

    var parsedUrl = parse(url);
    var requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      method: method,
      path: parsedUrl.path,
      headers: {
        'X-Pact-Mock-Service': 'true',
        'Content-Type': 'application/json'
      }
    };

    var request = http.request(requestOptions, function (response) {
      var responseText = '';

      response.on('data', function (chunk) {
        responseText += chunk.toString();
      });

      response.on('error', function (err) {
        callback(new Error('Error calling ' + url + ' - ' + err.message));
      });

      response.on('end', function () {
        callback(null, {responseText: responseText, status: response.statusCode});
      });
    });

    request.on('error', function (err) {
      callback(new Error('Error calling ' + url + ' - ' + err.message));
    });

    request.end(body || '');
  };

  var makeRequestForBrowser = function(method, url, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(event) {
      callback(null, event.target);
    };
    xhr.onerror = function() {
      callback(new Error('Error calling ' + url));
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader('X-Pact-Mock-Service', 'true');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
  };

  this.makeRequest = (Pact.IsNodeJs) ? makeRequestForNode : makeRequestForBrowser;

}).apply(Pact.Http);
Pact.MockServiceRequests = Pact.MockServiceRequests || {};

(function() {

  var createResponseHandler = function (message, callback) {
    return function(error, response) {
      if (error) {
        callback(error);
      } else if (200 !== response.status) {
        var errorMessage = '\npact-consumer-js-dsl: ' + message + '\n' + response.responseText + '\n';
        callback(new Error(errorMessage));
      } else {
        callback(null);
      }
    };
  };

  this.getVerification = function(baseUrl, callback) {
    Pact.Http.makeRequest('GET', baseUrl + '/interactions/verification', null, createResponseHandler('Pact verification failed', callback));
  };

  this.deleteInteractions = function(baseUrl, callback) {
    Pact.Http.makeRequest('DELETE', baseUrl + '/interactions', null, createResponseHandler('Pact interaction cleanup failed', callback));
  };

  this.putInteractions = function(interactions, baseUrl, callback) {
    Pact.Http.makeRequest('PUT', baseUrl + '/interactions', JSON.stringify(interactions), createResponseHandler('Pact interaction setup failed', callback));
  };

  this.postPact = function(pactDetails, baseUrl, callback) {
    Pact.Http.makeRequest('POST', baseUrl + '/pact', JSON.stringify(pactDetails), createResponseHandler('Could not write the pact file', callback));
  };

}).apply(Pact.MockServiceRequests);
Pact.MockService = Pact.MockService || {};

(function() {


  function MockService(opts) {
    var _baseURL = 'http://127.0.0.1:' + opts.port;
    var _interactions = [];

    if (typeof(opts.done) !== 'function') {
      throw new Error('Error creating MockService. Please provide an option called "done", that is a function that asserts (using your test framework of choice) that the first argument, error, is null.');
    }

    var _doneCallback = opts.done;

    var _pactDetails = {
      consumer: {
        name: opts.consumer
      },
      provider: {
        name: opts.provider
      }
    };

    var setupInteractions = function(interactions, callback) {
      Pact.MockServiceRequests.putInteractions({interactions: interactions}, _baseURL, callback);
    };

    var setupInteractionsSequentially = function(interactions, index, callback) {
      if (index >= interactions.length) {
        callback();
        return;
      }

      Pact.MockServiceRequests.postInteraction(interactions[index], _baseURL, function(error) {
        if (error) {
          callback(error);
          return;
        }

        setupInteractionsSequentially(interactions, index + 1, callback);
      });
    };

    var cleanAndSetup = function(callback) {
      // PUT the new interactions
      var interactions = _interactions;
      _interactions = []; //Clean the local setup
      setupInteractions(interactions, callback);
    };

    var verifyAndWrite = function(callback) {
      //Verify that the expected interactions have occurred
      Pact.MockServiceRequests.getVerification(_baseURL, function(verifyError) {
        if (verifyError) {
          callback(verifyError);
          return;
        }

        //Write the pact file
        Pact.MockServiceRequests.postPact(_pactDetails, _baseURL, callback);
      });
    };

    this.given = function(providerState) {
      var interaction = Pact.givenInteraction(providerState);
      _interactions.push(interaction);
      return interaction;
    };

    this.uponReceiving = function(description) {
      var interaction = Pact.receivingInteraction(description);
      _interactions.push(interaction);
      return interaction;
    };

    this.run = function(onRunComplete, testFunction) {
      var done = function (error) {
        _doneCallback(error);
        onRunComplete();
      };

      cleanAndSetup(function(error) {
        if (error) {
          done(error);
          return;
        }

        var runComplete = function() {
          verifyAndWrite(done);
        };

        testFunction(runComplete); // Call the tests
      });
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
