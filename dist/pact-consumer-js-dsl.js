!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Pact=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var mockService = require(3);
var interaction = require(2);

var Pact = {};

(function() {

  // consumerName, providerName, port, pactDir
  this.mockService = function(opts) {
    return mockService.create(opts);
  };

  this.givenInteraction = function(providerState) {
    return interaction.create().given(providerState);
  };

  this.receivingInteraction = function(description) {
    return interaction.create().uponReceiving(description);
  };

}).apply(Pact);

module.exports = Pact;

},{}],2:[function(require,module,exports){
'use strict';

var interaction = {};

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

}).apply(interaction);

module.exports = interaction;

},{}],3:[function(require,module,exports){
'use strict';

var interaction = require(2);

var mockService = {};

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
      }
    };

    this.given = function(providerState) {
      var i = interaction.create().given(providerState);
      _interactions.push(i);
      return i;
    };

    this.uponReceiving = function(description) {
      var i = interaction.create().uponReceiving(description);
      _interactions.push(i);
      return i;
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

}).apply(mockService);

module.exports = mockService;

},{}]},{},[1])(1)
});