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

                //Run the tests
                helloProvider.run(function(complete){
                    expect(client.sayHello()).toEqual("Hello");
                    complete();
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
            
        });// end describe
    });// end define
