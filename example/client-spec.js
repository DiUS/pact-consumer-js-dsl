define(['client', 'mockService'], function(Client, MockService) {
	//Create your client.
  var client = new Client("http://localhost:1234");
  //Ceate a new MockService.
  var helloProvider = new MockService("hello-consumer", "hello-provider", "1234");

  describe("Client", function () {

    describe("sayHello", function () {
      it("Should say Hello", function() {
        //Add interaction
        helloProvider
          .uponReceiving("a request for hello")
          .withRequest("get", "/sayHello")
          .willRespondWith(200, { "Content-Type": "application/json" }, {reply: "Hello" });

        //Run the tests
        helloProvider.run(function(complete){
          expect(client.sayHello()).toEqual("Hello");
          complete();
        });

      });
    });

    describe("findFriendsByAgeAndChildren", function () {
      it("returns some friends", function() {
        //Add interaction
        helloProvider
          .uponReceiving("a request friends")
          .withRequest({
            method: 'get',
            path: '/friends',
            query: {
              age: '30', //remember query params are always strings
              children: ['Mary Jane','James'] // specify params with multiple values in an array
            },
            headers: {
              'Accept': 'application/json'
            }
          })
          .willRespondWith({
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
              friends: [{name: 'Sue'}]
            }
          });

        //Run the tests
        helloProvider.run(function(complete){
          expect(client.findFriendsByAgeAndChildren('30', ['Mary Jane', 'James'])).toEqual([{name: 'Sue'}]);
          complete();
        });

      });
    });


    describe("unfriendMe", function () {
      it("Should say Bye", function() {
        //Add interaction
        helloProvider
          .given("I am friends with Fred")
          .uponReceiving("a request to unfriend")
          .withRequest("put", "/unfriendMe")
          .willRespondWith({
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
              reply: "Bye"
            }
          });

        //Run the tests
        helloProvider.run(function(complete){
          var done = false;
          runs(function(){
            client.unfriendMe(
              function(val){
                expect(val).toEqual("Bye");
                done=true;
                complete();
              }
            );
          });

          waitsFor(function() {
            return done;
          }, "Response rcvd", 1000);
        });
      });
    }); //end describe unfriendMe
  }); //end describe Client
});// end define
