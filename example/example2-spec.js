define(['jquery', 'pactBuilder', 'interaction'],
    function ($, PactBuilder, Given) {

        describe("example pact test2", function () {
            var pactBuilder;

            beforeEach(function() {
                //Ceate a new pactBuilder
                pactBuilder = new PactBuilder("pact-consumer2", "pact-provider2", "1234");
                //Configure the pactBuilder
                pactBuilder
                    .withInteractions([
                        Given("foo exists")
                            .uponReceiving("a request for foo")
                            .withRequest(
                                path = "/foo", 
                                method = "get"
                            )
                            .willRespondWith(
                                status = 200,
                                headers = { "Content-Type": "application/json"},
                                body = {foo: "bar"}
                            ),
                            Given("foo2 exists")
                            .uponReceiving("a request for foo2")
                            .withRequest(
                                path = "/foo2", 
                                method = "get"
                            )
                            .willRespondWith(
                                status = 200,
                                headers = { "Content-Type": "application/json"},
                                body = {foo: "bar2"}
                            )
                    ]);
            });

            it("get the expected response", function () {
                
                //Test Client - the actual test
                var testClient = function (port, completed) {
                    var url = "http://localhost:" + port + "/foo";
                    var request = $.ajax({
                        url: url,
                        type: "GET", 
                        async: false  
                    });

                    request.always(function(data){
                        expect(data.foo).toBe("bar");
                        completed();
                    });
                };

                //Run the test
                pactBuilder.runInteractions(testClient);
            });

            it("get the expected response2 ", function () {
                
                //Test Client - the actual test
                var testClient = function (port, completed) {
                    var url = "http://localhost:" + port + "/foo2";
                    var request = $.ajax({
                        url: url,
                        type: "GET", 
                        async: false 
                    });

                    request.always(function(data){
                        expect(data.foo).toBe("bar2");
                        completed();
                    });
                };

                //Run the test
                pactBuilder.runInteractions(testClient);
            });
        });
    });