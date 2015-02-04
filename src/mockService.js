Pact.MockService = Pact.MockService || {};

(function() {


  function MockService(opts) {
    var _baseURL = 'http://127.0.0.1:' + opts.port;
    var _interactions = [];

    if (typeof(opts.done) !== 'function') {
      throw new Error('Error creating MockService. Please provide an option called "done", that is a function that asserts (using your test framework of choice) that the first argument, error, is null.');
    }

    var _doneCallback = opts.done;

    var _pactDetails = {
      consumer: {
        name: opts.consumer
      },
      provider: {
        name: opts.provider
      }
    };

    var setupInteractions = function(interactions, callback) {
      Pact.MockServiceRequests.putInteractions({interactions: interactions}, _baseURL, callback);
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
      // PUT the new interactions
      var interactions = _interactions;
      _interactions = []; //Clean the local setup
      setupInteractions(interactions, callback);
    };

    var verifyAndWrite = function(callback) {
      //Verify that the expected interactions have occurred
      Pact.MockServiceRequests.getVerification(_baseURL, function(verifyError) {
        if (verifyError) {
          callback(verifyError);
          return;
        }

        //Write the pact file
        Pact.MockServiceRequests.postPact(_pactDetails, _baseURL, callback);
      });
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
      var done = function (error) {
        _doneCallback(error);
        onRunComplete();
      };

      cleanAndSetup(function(error) {
        if (error) {
          done(error);
          return;
        }

        var runComplete = function() {
          verifyAndWrite(done);
        };

        testFunction(runComplete); // Call the tests
      });
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
