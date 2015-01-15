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
  this.getVerification = function(baseUrl, callback) {
    Pact.Http.makeRequest('GET', baseUrl + '/interactions/verification', null, function(error, response) {
      if (error) {
        callback(error);
      } else if (200 !== response.status) {
        callback(new Error('pact-js-dsl: Pact verification failed. ' + response.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.deleteInteractions = function(baseUrl, callback) {
    Pact.Http.makeRequest('DELETE', baseUrl + '/interactions', null, function(error, response) {
      if (error) {
        callback(error);
      } else if (200 !== response.status) {
        callback(new Error('pact-js-dsl: Pact cleanup failed. ' + response.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.postInteraction = function(interaction, baseUrl, callback) {
    Pact.Http.makeRequest('POST', baseUrl + '/interactions', JSON.stringify(interaction), function(error, response) {
      if (error) {
        callback(error);
      } else if (200 !== response.status) {
        callback(new Error('pact-js-dsl: Pact interaction setup failed. ' + response.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.postPact = function(pactDetails, baseUrl, callback) {
    Pact.Http.makeRequest('POST', baseUrl + '/pact', JSON.stringify(pactDetails), function(error, response) {
      if (error) {
        callback(error);
      } else if (200 !== response.status) {
        throw 'pact-js-dsl: Could not write the pact file. ' + response.responseText;
      } else {
        callback(null);
      }
    });
  };
}).apply(Pact.MockServiceRequests);
Pact.MockService = Pact.MockService || {};

(function() {


  function MockService(opts) {
    var _baseURL = 'http://127.0.0.1:' + opts.port;
    var _doneCallback = function(error) {
      if (error) {
        throw error;
      }
    };
    var _interactions = [];

    var _pactDetails = {
      consumer: {
        name: opts.consumer
      },
      provider: {
        name: opts.provider
      }
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
      // Cleanup the interactions from the previous test
      Pact.MockServiceRequests.deleteInteractions(_baseURL, function(deleteInteractionsError) {
        if (deleteInteractionsError) {
          callback(deleteInteractionsError);
          return;
        }

        // Post the new interactions
        var interactions = _interactions;
        _interactions = []; //Clean the local setup
        setupInteractionsSequentially(interactions, 0, callback);
      });
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

    this.run = function(testFunction) {
      cleanAndSetup(function(error) {
        if (error) {
          _doneCallback(error);
          return;
        }

        var runComplete = function() {
          verifyAndWrite(_doneCallback);
        };

        testFunction(runComplete); // Call the tests
      });
    };

    this.done = function(callback) {
      _doneCallback = callback;
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
