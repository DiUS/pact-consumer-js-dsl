'use strict';

var Pact = Pact || {};
Pact.IsNodeJs = typeof module === 'object' && typeof module.exports === 'object';

if (Pact.IsNodeJs) {
  module.exports = Pact;
}
