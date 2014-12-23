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
      }
    };

    var setupInteractionsSequentially = function (interactions, index, callback) {
      if (index >= interactions.length) {
        callback();
        return;
      }

      Pact.MockServiceRequests.postInteraction(interactions[index], _baseURL, function (error) {
        if (error) {
          callback(error);
          return;
        }

        setupInteractionsSequentially(interactions, index + 1, callback)
      });
    };

    var cleanAndSetup = function (callback) {
      // Cleanup the interactions from the previous test
      Pact.MockServiceRequests.deleteInteractions(_baseURL, function (deleteInteractionsError) {
        if (deleteInteractionsError) {
          callback(deleteInteractionsError);
          return;
        }

        // Post the new interactions
        var interactions = _interactions;
        _interactions = []; //Clean the local setup
        setupInteractionsSequentially(interactions, 0, callback);
      });
    };

    var verifyAndWrite = function (callback) {
      //Verify that the expected interactions have occurred
      Pact.MockServiceRequests.getVerification(_baseURL, function (verifyError) {
        if (verifyError) {
          callback(verifyError);
          return;
        }

        //Write the pact file
        Pact.MockServiceRequests.postPact(_pactDetails, _baseURL, callback);
      });
    };

    var throwOnError = function (error) {
      if (error) {
        throw error;
      }
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

    this.run = function(testFunction) {
      cleanAndSetup(function (error) {
        if (error) {
          throw error;
        }

        var runComplete = function(testComplete) {
          testComplete = (typeof testComplete === 'function') ? testComplete : throwOnError;
          verifyAndWrite(testComplete);
        };

        testFunction(runComplete); // Call the tests
      });
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
