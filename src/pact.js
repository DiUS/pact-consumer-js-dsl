'use strict';

var Pact = Pact || {};

(function() {

  // consumerName, providerName, port, pactDir
  this.createMockService = function(opts) {
    return Pact.MockService.init(opts);
  };

  this.createGivenInteraction = function(providerState) {
    var interaction = Pact.Interaction.create();
    return interaction.given(providerState);
  };

  this.createUponReceivingInteraction = function(description) {
    var interaction = Pact.Interaction.create();
    return interaction.uponReceiving(description);
  };

}).apply(Pact);
