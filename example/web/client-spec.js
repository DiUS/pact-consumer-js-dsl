(function() {

  describe("Client", function() {

    var client, helloProvider;

    // ugly but works... guess would be good to bring jasmine-beforeAll
    beforeEach(function() {
      client = example.createClient('http://localhost:1234');
      helloProvider = Pact.mockService({
        consumer: 'Hello Consumer',
        provider: 'Hello Provider',
        port: 1234,
        done: function (error) {
          expect(error).toBe(null);
        }
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
        helloProvider.run(done, function(runComplete) {
          expect(client.sayHello()).toEqual("Hello");
          runComplete();
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
              age: Pact.Match.term({generate: '30', matcher: '\\d+'}), //remember query params are always strings
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
              friends: Pact.Match.eachLike({
                name: Pact.Match.somethingLike('Sue') // Doesn't tie the Provider to a particular friend such as 'Sue'
              }, {min: 1})
            }
          });

        //Run the tests
        helloProvider.run(done, function(runComplete) {
          expect(client.findFriendsByAgeAndChildren('33', ['Mary Jane', 'James'])).toEqual([{
            name: 'Sue'
          }]);
          runComplete();
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
        helloProvider.run(done, function(runComplete) {

          function success(message) {
            expect(message).toEqual("Bye");
            runComplete();
          }

          function error(response) {
            runComplete();
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
          helloProvider.run(done, function(runComplete) {

            function success(message) {
              //The success callback should *not* be invoked!
              expect(true).toEqual(false);
              runComplete();
            }

            function error(message) {
              //The error callback *should* be invoked
              expect(message).toEqual("No friends :(");
              runComplete();
            }

            client.unfriendMe(success, error);

          });
        });
      });
    });
  });
})();
