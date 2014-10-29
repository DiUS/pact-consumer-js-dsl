define(
    ['client', 'mockService'],
    function(Client, MockService) {
    	var client = new Client();
        describe("example pact test for hello client", function() {
            beforeEach(function() {
                //Ceate a new MockService
                helloProvider = new MockService("hello-consumer", "hello-provider", "1234");

                helloProvider
                    .uponReceiving("a request for hello")
                    .withRequest( path ="/sayHello", 
                                method = "get")
                    .willRespondWith(status = 200,
                                headers = {
                                    "Content-Type": "application/json"
                                },
                                body = {
                                    reply: "Hello"
                                });

                helloProvider
                    .given("I am friends with Fred")
                    .uponReceiving("a request to unfriend")
                    .withRequest( path = "/unfriendMe", 
                                method = "put")
                    .willRespondWith(status = 200,
                                headers = {
                                    "Content-Type": "application/json"
                                },
                                body = {
                                    reply: "Bye"
                                });
            });// end beforeEach
 
            it("Should say Hello", function() {
                var clientTest = function(completed) {
                    expect(client.sayHello()).toEqual("Hello");
                    completed();
                };
                //Run the test
                helloProvider.runInteractions(clientTest);
            });

            it("Should say Bye", function() {
                var clientTest = function(completed) {
                    expect(client.unfriendMe()).toEqual("Bye");
                    completed();
                };
                //Run the test
                helloProvider.runInteractions(clientTest);
            });

        });// end describe
    });// end define
