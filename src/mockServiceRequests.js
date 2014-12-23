'use strict';

Pact.MockServiceRequests = Pact.MockServiceRequests || {};

(function() {
  var request = function(method, url, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(event) {
      callback(null, event.target);
    };
    xhr.onerror = function() {
      callback(new Error('Error calling ' + url));
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader('X-Pact-Mock-Service', 'true');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(body);
  };

  this.getVerification = function(baseUrl, callback) {
    request('GET', baseUrl + '/interactions/verification', null, function(error, xhr) {
      if (error) {
        callback(error);
      } else if (200 !== xhr.status) {
        callback(new Error('pact-js-dsl: Pact verification failed. ' + xhr.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.deleteInteractions = function(baseUrl, callback) {
    request('DELETE', baseUrl + '/interactions', null, function(error, xhr) {
      if (error) {
        callback(error);
      } else if (200 !== xhr.status) {
        callback(new Error('pact-js-dsl: Pact cleanup failed. ' + xhr.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.postInteraction = function(interaction, baseUrl, callback) {
    request('POST', baseUrl + '/interactions', JSON.stringify(interaction), function(error, xhr) {
      if (error) {
        callback(error);
      } else if (200 !== xhr.status) {
        callback(new Error('pact-js-dsl: Pact interaction setup failed. ' + xhr.responseText));
      } else {
        callback(null);
      }
    });
  };

  this.postPact = function(pactDetails, baseUrl, callback) {
    request('POST', baseUrl + '/pact', JSON.stringify(pactDetails), function(error, xhr) {
      if (error) {
        callback(error);
      } else if (200 !== xhr.status) {
        throw 'pact-js-dsl: Could not write the pact file. ' + xhr.responseText;
      } else {
        callback(null);
      }
    });
  };
}).apply(Pact.MockServiceRequests);