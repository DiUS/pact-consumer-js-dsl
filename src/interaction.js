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

}).apply(interaction);

module.exports = interaction;
