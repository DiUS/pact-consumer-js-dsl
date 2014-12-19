(function() {

  describe("Client", function() {

    var client, helloProvider;

    // ugly but works... guess would be good to bring jasmine-beforeAll
    beforeEach(function() {
      client = example.createClient('http://localhost:1234');
      helloProvider = helloProvider ? helloProvider : Pact.mockService({
        consumerName: 'Hello Consumer',
        providerName: 'Hello Provider',
        port: 1234,
        pactDir: './tmp/pacts'
      });
    });

    afterEach(function() {
      helloProvider.write();
    });

    describe("sayHello", function () {
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
    });

    describe("findFriendsByAgeAndChildren", function () {
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
    });


    describe("unfriendMe", function () {

      it("should unfriend me", function(jasmineDone) {
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
        helloProvider.run(function(pactDone) {

          function success(message) {
            expect(message).toEqual("Bye");
            pactDone(jasmineDone);
          }

          function error(response) {
            pactDone(jasmineDone);
            expect(true).toEqual(false);
          }

          client.unfriendMe(success, error);

        });
      });

      describe("when there are no friends", function () {
        it("returns an error message", function (jasmineDone) {
          //Add interaction
          helloProvider
            .given("I have no friends")
            .uponReceiving("a request to unfriend")
            .withRequest("put", "/unfriendMe")
            .willRespondWith(404);

          //Run the tests
          helloProvider.run(function(pactDone) {

            function success(message) {
              //The success callback should *not* be invoked!
              expect(true).toEqual(false);
              pactDone(jasmineDone);
            }

            function error(message) {
              //The error callback *should* be invoked
              expect(message).toEqual("No friends :(")
              pactDone(jasmineDone);
            }

            client.unfriendMe(success, error);

          });
        });
      });
    });
  });
})();
