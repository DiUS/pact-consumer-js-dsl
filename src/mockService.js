'use strict';

Pact.MockService = Pact.MockService || {};

(function() {


  function MockService(opts) {
    var _baseURL = 'http://127.0.0.1:' + opts.port;
    var _interactions = [];

    var _pactDetails = {
      consumer: {
        name: opts.consumer
      },
      provider: {
        name: opts.provider
      },
      pact_dir: opts.pactDir
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

    this.clean = function() {
      var response = this.request('DELETE', _baseURL + '/interactions', null);
      if (_isNotSuccess(response)) {
        throw 'pact-consumer-js-dsl: Pact cleanup failed. ' + response.responseText;
      }
    };

    this.setup = function() {
      var interactions = _interactions;
      _interactions = []; //Clean the local setup
      var self = this;

      interactions.forEach(function(interaction) {
        var response = self.request('POST', _baseURL + '/interactions', JSON.stringify(interaction));
        if (_isNotSuccess(response)) {
          throw 'pact-consumer-js-dsl: Pact interaction setup failed. ' + response.responseText;
        }
      });
    };

    this.verify = function() {
      var response = this.request('GET', _baseURL + '/interactions/verification', null);
      if (_isNotSuccess(response)) {
        throw 'pact-consumer-js-dsl: Pact verification failed. ' + response.responseText;
      }
    };

    this.write = function() {
      var response = this.request('POST', _baseURL + '/pact', JSON.stringify(_pactDetails));
      if (_isNotSuccess(response)) {
        throw 'pact-consumer-js-dsl: Could not write the pact file. ' + response.responseText;
      }
    };

    this.run = function(testFunction) {
      var self = this;
      self.clean(); // Cleanup the interactions from the previous test
      self.setup(); // Post the new interactions

      var runComplete = function(testComplete) {
        self.verify(); //Verify that the expected interactions have occurred
        self.write();  //Write the pact file

        if (typeof(testComplete) === 'function') {
          testComplete();
        }
      };

      testFunction(runComplete); // Call the tests
    };

    this.request = function(method, url, body) {
      var response = new XMLHttpRequest();
      response.open(method, url, false);
      response.setRequestHeader('X-Pact-Mock-Service', 'true');
      response.setRequestHeader('Content-type', 'application/json');
      response.send(body);
      return response;
    };

    function _isNotSuccess(response) {
      return parseInt(response.status, 10) !== 200;
    }
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
