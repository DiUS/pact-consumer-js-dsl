Pact.MockService = Pact.MockService || {};

(function() {

  function MockService(opts) {
    var _baseURL = 'http://127.0.0.1:' + opts.port;
    var _interactions = [];
    var _doneCallback = opts.done || function(){};

    if (typeof(_doneCallback) !== 'function') {
      throw new Error('Error creating MockService. \'Done\' option must be a function.');
    }

    var _pactDetails = {
      consumer: {
        name: opts.consumer
      },
      provider: {
        name: opts.provider
      }
    };

    var setupInteractionsSequentially = function(interactions, index, callback) {
      if (index >= interactions.length) {
        callback();
        return;
      }

      Pact.MockServiceRequests.postInteraction(interactions[index], _baseURL, function(error) {
        if (error) {
          callback(error);
          return;
        }

        setupInteractionsSequentially(interactions, index + 1, callback);
      });
    };

    var cleanAndSetup = function(callback) {
      // Cleanup the interactions from the previous test
      Pact.MockServiceRequests.deleteInteractions(_baseURL, function(deleteInteractionsError) {
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

    this.verifyAndWrite = function(callback) {
      callback = callback || function(){};
      var that = this;
      //Verify that the expected interactions have occurred
      this.verify(function(verifyError) {
        if (verifyError) {
          callback(verifyError);
          return;
        }

          that.write(callback);
      });
    };

    this.verify = function(callback) {
        callback = callback || function(){};
        //Verify that the expected interactions have occurred
        Pact.MockServiceRequests.getVerification(_baseURL, callback);
    };

    this.write = function(callback) {
        callback = callback || function(){};
        Pact.MockServiceRequests.postPact(_pactDetails, _baseURL, callback);
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

    this.run = function(onRunComplete, testFunction) {
      onRunComplete = onRunComplete || function(){};
      testFunction = testFunction || function(){};

      var done = function (error) {
        _doneCallback(error);
        onRunComplete();
      };

        var that = this;

      cleanAndSetup(function(error) {
        if (error) {
          done(error);
          return;
        }

        var runComplete = function() {
          that.verifyAndWrite(done);
        };

        testFunction(runComplete); // Call the tests
      });
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
