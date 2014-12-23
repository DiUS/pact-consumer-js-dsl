'use strict';

var Pact = Pact || {};

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

'use strict';

Pact.Interaction = Pact.Interaction || {};

(function() {

  this.create = function() {
    return {
      provider_state: '',
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
          this.request.method = firstParameter.method;
          this.request.path = firstParameter.path;
          this.request.query = firstParameter.query;
          this.request.headers = firstParameter.headers;
          this.request.body = firstParameter.body;
        } else {
          this.request.method = firstParameter;
          this.request.path = path;
          this.request.headers = headers;
          this.request.body = body;
        }

        if (!this.request.method || !this.request.path) {
          throw 'pact-js-dsl\'s "withRequest" function requires "method" and "path" parameters';
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
          throw 'pact-js-dsl\'s "willRespondWith" function requires "status" parameter';
        }

        return this;
      }
    };
  };

}).apply(Pact.Interaction);

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
      var xhr = this.request('DELETE', _baseURL + '/interactions', null);
      if (200 !== xhr.status) {
        throw 'pact-js-dsl: Pact cleanup failed. ' + xhr.responseText;
      }
    };

    this.setup = function() {
      var interactions = _interactions;
      _interactions = []; //Clean the local setup
      var self = this;

      interactions.forEach(function(interaction) {
        var xhr = self.request('POST', _baseURL + '/interactions', JSON.stringify(interaction));
        if (200 !== xhr.status) {
          throw 'pact-js-dsl: Pact interaction setup failed. ' + xhr.responseText;
        }
      });
    };

    this.verify = function() {
      var xhr = this.request('GET', _baseURL + '/interactions/verification', null);
      if (200 !== xhr.status) {
        throw 'pact-js-dsl: Pact verification failed. ' + xhr.responseText;
      }
    };

    this.write = function() {
      var xhr = this.request('POST', _baseURL + '/pact', JSON.stringify(_pactDetails));
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
        self.write();  //Write the pact file

        if (typeof(testComplete) === 'function') {
          testComplete();
        }
      };

      testFunction(runComplete); // Call the tests
    };

    this.request = function(method, url, body) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, false);
      xhr.setRequestHeader('X-Pact-Mock-Service', 'true');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(body);
      return xhr;
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
