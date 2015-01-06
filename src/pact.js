'use strict';

var mockService = require('./mockService');
var interaction = require('./interaction');

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
