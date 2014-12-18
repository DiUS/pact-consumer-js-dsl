(function() {

  describe("Client", function() {

    var client, helloProvider;

    // ugly but works... guess would be good to bring jasmine-beforeAll
    beforeEach(function() {
      client = pact.createClient('http://localhost:1234');
      helloProvider = helloProvider ? helloProvider : Pact.createMockService({
        consumerName: 'hello-consumer',
        providerName: 'hello-provider',
        port: 1234
      });
    });

    it("should say hello", function() {

      helloProvider
        .uponReceiving("a request for hello")
        .withRequest("get", "/sayHello")
        .willRespondWith(200, {
          "Content-Type": "application/json"
        }, {
          reply: "Hello"
        });

      //Run the tests
      helloProvider.run(function(complete) {
        expect(client.sayHello()).toEqual("Hello");
        complete();
      });

    });

    it("should return some friends", function() {
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
      helloProvider.run(function(complete) {
        expect(client.findFriendsByAgeAndChildren('30', ['Mary Jane', 'James'])).toEqual([{
          name: 'Sue'
        }]);
        complete();
      });

    });


    it("should unfriend me", function() {
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
      helloProvider.run(function(complete) {
        var done = false;
        runs(function() {
          client.unfriendMe(
            function(val) {
              expect(val).toEqual("Bye");
              done = true;
              complete();
            }
          );
        });

        waitsFor(function() {
          return done;
        }, "Response rcvd", 1000);
      });
    });

  });

})();
