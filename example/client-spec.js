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
                        Given("Say hello")
	                        .uponReceiving("a request for hello")
	                        .withRequest(
	                            path = "/sayHello", 
	                            method = "get"
	                        )
	                        .willRespondWith(
	                            status = 200,
	                            headers = {
	                                "Content-Type": "application/json"
	                            },
	                            body = {
	                                reply: "Hello"
	                            }
	                        ),
                        //Second interaction
                        Given("Say bye")
	                        .uponReceiving("a request for bye")
	                        .withRequest(
	                            path = "/unfriendMe", 
	                            method = "put"
	                        )
	                        .willRespondWith(
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
                var testClient = function(port, completed) {
                    expect(client.sayHello()).toEqual("Hello");
                    completed();
                };
                //Run the test
                pactBuilder.runInteractions(testClient);
            });

            it("Should say Bye", function() {
                var testClient = function(port, completed) {
                    expect(client.unfriendMe()).toEqual("Bye");
                    completed();
                };
                //Run the test
                pactBuilder.runInteractions(testClient);
            });

        });
    });
