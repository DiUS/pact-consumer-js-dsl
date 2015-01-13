(function() {

  describe("Client", function() {

    var client, helloProvider, withNoError;

    withNoError = function (doneCallback) {
      return function (error) {
        expect(error).toBe(null);
        doneCallback();
      };
    };

    // ugly but works... guess would be good to bring jasmine-beforeAll
    beforeEach(function() {
      client = example.createClient('http://localhost:1234');
      helloProvider = Pact.mockService({
        consumer: 'Hello Consumer',
        provider: 'Hello Provider',
        port: 1234
      });
    });

    describe("sayHello", function () {
      it("should say hello", function(done) {

        helloProvider
          .uponReceiving("a request for hello")
          .withRequest("get", "/sayHello")
          .willRespondWith(200, {
            "Content-Type": "application/json"
          }, {
            reply: "Hello"
          });

        //Run the tests
        helloProvider.run(function(runComplete) {
          expect(client.sayHello()).toEqual("Hello");
          runComplete(withNoError(done));
        });

      });
    });

    describe("findFriendsByAgeAndChildren", function () {
      it("should return some friends", function(done) {
        //Add interaction
        helloProvider
          .uponReceiving("a request friends")
          .withRequest({
            method: 'get',
            path: '/friends',
            query: {
              age: '30', //remember query params are always strings
              children: ['Mary Jane', 'James'] // specify params with multiple values in an array
            },
            headers: {
              'Accept': 'application/json'
            }
          })
          .willRespondWith({
            status: 200,
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              friends: [{
                name: 'Sue'
              }]
            }
          });

        //Run the tests
        helloProvider.run(function(runComplete) {
          expect(client.findFriendsByAgeAndChildren('30', ['Mary Jane', 'James'])).toEqual([{
            name: 'Sue'
          }]);
          runComplete(withNoError(done));
        });

      });
    });


    describe("unfriendMe", function () {

      it("should unfriend me", function(done) {
        //Add interaction
        helloProvider
          .given("I am friends with Fred")
          .uponReceiving("a request to unfriend")
          .withRequest("put", "/unfriendMe")
          .willRespondWith({
            status: 200,
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              reply: "Bye"
            }
          });


        //Run the tests
        helloProvider.run(function(runComplete) {

          function success(message) {
            expect(message).toEqual("Bye");
            runComplete(withNoError(done));
          }

          function error(response) {
            runComplete(withNoError(done));
            expect(true).toEqual(false);
          }

          client.unfriendMe(success, error);

        });
      });

      describe("when there are no friends", function () {
        it("returns an error message", function (done) {
          //Add interaction
          helloProvider
            .given("I have no friends")
            .uponReceiving("a request to unfriend")
            .withRequest("put", "/unfriendMe")
            .willRespondWith(404);

          //Run the tests
          helloProvider.run(function(runComplete) {

            function success(message) {
              //The success callback should *not* be invoked!
              expect(true).toEqual(false);
              runComplete(withNoError(done));
            }

            function error(message) {
              //The error callback *should* be invoked
              expect(message).toEqual("No friends :(");
              runComplete(withNoError(done));
            }

            client.unfriendMe(success, error);

          });
        });
      });
    });
  });
})();
