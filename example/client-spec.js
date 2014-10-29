define(
    ['client', 'mockService'],
    function(Client, MockService) {
    	//Create your client.
        var client = new Client("http://localhost:1234");

        //Setup the mock service
        describe("example pact test for hello client", function() {
            beforeEach(function() {
                //Ceate a new MockService
                helloProvider = new MockService("hello-consumer", "hello-provider", "1234");

                //Add an interaction
                helloProvider
                    .uponReceiving("a request for hello")
                    .withRequest( 
                        method="get",
                        path="/sayHello")
                    .willRespondWith(
                        status = 200,
                        headers = {
                            "Content-Type": "application/json"
                        },
                        body = {
                            reply: "Hello"
                        });

                //Add another interaction
                helloProvider
                    .given("I am friends with Fred")
                    .uponReceiving("a request to unfriend")
                    .withRequest( 
                        method = "put",
                        path = "/unfriendMe"
                        )
                    .willRespondWith(
                        status = 200,
                        headers = {
                            "Content-Type": "application/json"
                        },
                        body = {
                            reply: "Bye"
                        });
            });
 
            it("Should say Hello", function() {
                //This is the test function
                var clientTest = function(completed) {
                    expect(client.sayHello()).toEqual("Hello");
                    completed();
                };
                //Run the test
                helloProvider.runInteractions(clientTest);
            });

            it("Should say Bye", function() {
                //This is the test function
                var clientTest = function(completed) {
                    expect(client.unfriendMe()).toEqual("Bye");
                    completed();
                };
                //Run the test
                helloProvider.runInteractions(clientTest);
            });

        });// end describe
    });// end define
