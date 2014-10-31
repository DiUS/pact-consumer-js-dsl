define(
    ['client', 'mockService'],
    function(Client, MockService) {
    	//Create your client.
        var client = new Client("http://localhost:1234");
        //Ceate a new MockService.
        var helloProvider = new MockService("hello-consumer", "hello-provider", "1234");

        //Setup the mock service
        describe("example pact test for hello client", function() {
            it("Should say Hello", function() {
                //Add interaction
                console.log('jasmine-version:' + jasmine.getEnv().versionString());
                helloProvider
                    .uponReceiving("a request for hello")
                    .withRequest("get", "/sayHello")
                    .willRespondWith({
                        status: 200, 
                        headers: { "Content-Type": "application/json" },
                        body: {
                            reply: "Hello"
                        }
                    });
                //Run the test
                helloProvider.runInteractions(function(completed) {
                    expect(client.sayHello()).toEqual("Hello");
                    completed();
                });
            });

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
                //Run the test
                helloProvider.runInteractions(function(completed) {
                    expect(client.unfriendMe()).toEqual("Bye");
                    completed();
                });
            });

 
        });// end describe
    });// end define
