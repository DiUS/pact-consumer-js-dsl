define(
    ['client', 'pactBuilder', 'interaction'],
    function(Client, PactBuilder, UponReceiving) {
    	var client = new Client();
        describe("example pact test for hello client", function() {
            beforeEach(function() {
                //Ceate a new pactBuilder
                pactBuilder = new PactBuilder("hello-consumer", "hello-provider", "1234");

                //Configure the pactBuilder
                pactBuilder
                    .withInteractions([ 
                    	//First interaction 
	                    UponReceiving("a request for hello")
	                        .with(
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
                        UponReceiving("a request to unfriend")
	                        .with(
	                            path = "/unfriendMe", 
	                            method = "put"
	                        )
                            .given("I am friends with Fred")
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
