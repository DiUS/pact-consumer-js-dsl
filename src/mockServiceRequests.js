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