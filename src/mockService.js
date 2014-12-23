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
      pact_dir: opts.pactDir ? opts.pactDir : '.'
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
      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', _baseURL + '/interactions', false);
      xhr.setRequestHeader('X-Pact-Mock-Service', true);
      xhr.send();
      if (200 !== xhr.status) {
        throw 'pact-js-dsl: Pact cleanup failed. ' + xhr.responseText;
      }
    };

    this.setup = function() {
      var interactions = _interactions;
      _interactions = []; //Clean the local setup

      interactions.forEach(function(interaction) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', _baseURL + '/interactions', false);
        xhr.setRequestHeader('X-Pact-Mock-Service', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(interaction));
        if (200 !== xhr.status) {
          throw 'pact-js-dsl: Pact interaction setup failed. ' + xhr.responseText;
        }
      });
    };

    this.verify = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', _baseURL + '/interactions/verification', false);
      xhr.setRequestHeader('X-Pact-Mock-Service', true);
      xhr.send();
      if (200 !== xhr.status) {
        throw 'pact-js-dsl: Pact verification failed. ' + xhr.responseText;
      }
    };

    this.write = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', _baseURL + '/pact', false);
      xhr.setRequestHeader('X-Pact-Mock-Service', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(_pactDetails));
      if (200 !== xhr.status) {
        throw 'pact-js-dsl: Could not write the pact file. ' + xhr.responseText;
      }
    };

    this.run = function(testFunction) {
      var self = this;
      self.clean(); // Cleanup the interactions from the previous test
      self.setup(); // Post the new interactions

      var runComplete = function(testComplete) {
        self.verify(); //Verify that the expected interactions have occurred

        if (typeof(testComplete) === 'function') {
          testComplete();
        }
      };

      testFunction(runComplete); // Call the tests
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
