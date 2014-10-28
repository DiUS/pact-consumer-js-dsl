define(
    ['client', 'pactBuilder', 'interaction'],
    function(Client, PactBuilder, Given) {
    	var client = new Client();
        describe("example pact test for hello client", function() {
            beforeEach(function() {
                //Ceate a new pactBuilder
                pactBuilder = new PactBuilder("hello-consumer", "hello-provider", "1234");

                //Configure the pactBuilder
                pactBuilder
                    .withInteractions([ 
                    	//First interaction
                        Given("Normal state of the server")
	                        .uponReceiving("a request for hello")
	                        .withRequest(
	                            path = "/sayHello", 
	                            method = "get"
	                        )
	                        .thenRespondWith(
	                            status = 200,
	                            headers = {
	                                "Content-Type": "application/json"
	                            },
	                            body = {
	                                reply: "Hello"
	                            }
	                        ),
                        //Second interaction
                        Given("I am a friend")
	                        .uponReceiving("a request to unfriend")
	                        .withRequest(
	                            path = "/unfriendMe", 
	                            method = "put"
	                        )
	                        .thenRespondWith(
	                            status = 200,
	                            headers = {
	                                "Content-Type": "application/json"
	                            },
	                            body = {
	                                reply: "Bye"
	                            }
	                        )
                    ]);
            });
 
            it("Should say Hello", function() {
                var clientTest = function(port, completed) {
                    expect(client.sayHello()).toEqual("Hello");
                    completed();
                };
                //Run the test
                pactBuilder.runInteractions(clientTest);
            });

            it("Should say Bye", function() {
                var clientTest = function(port, completed) {
                    expect(client.unfriendMe()).toEqual("Bye");
                    completed();
                };
                //Run the test
                pactBuilder.runInteractions(clientTest);
            });

        });
    });
