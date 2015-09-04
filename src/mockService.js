Pact.MockService = Pact.MockService || {};

(function() {

  function MockService(opts) {

    if (!opts || typeof opts.port === 'undefined' ) {
      throw new Error('Error creating MockService. Please provide the Pact mock service port');
    }

    var _host = opts.host || '127.0.0.1';
    var _baseURL = 'http://' + _host + ':' + opts.port;
    var _interactions = [];
    var self = this;

    if (typeof opts.done !== 'function') {
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

    //private
    this.setup = function(callback) {
      // PUT the new interactions
      var interactions = _interactions;
      _interactions = []; //Clean the local setup
      Pact.MockServiceRequests.putInteractions(interactions, _baseURL, callback);
    };

    this.verifyAndWrite = function(callback) {
      callback = callback || function(){};
      //Verify that the expected interactions have occurred
      this.verify(function(verifyError) {
        if (verifyError) {
          callback(verifyError);
          return;
        }

        self.write(callback);
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

    this.run = function(completeFunction, testFunction) {

      if (typeof(completeFunction) !== 'function' || typeof(testFunction) !== 'function') {
        throw new Error('Error calling run function. \'completeFunction\' and \'testFunction\' are mandatory.');
      }

      var done = function (error) {
        _doneCallback(error);
        completeFunction();
      };

      var that = this;
      this.setup(function(error) {
        if (error) {
          done(error);
          return;
        }

        // Call the tests
        testFunction(function() {
          that.verifyAndWrite(done);
        });
      });
    };
  }

  this.create = function(opts) {
    return new MockService(opts);
  };

}).apply(Pact.MockService);
