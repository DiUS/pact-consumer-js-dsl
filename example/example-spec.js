define(['jquery', 'pactBuilder', 'interaction'],
    function ($, PactBuilder, Given) {

        describe("example pact test", function () {
            var pactBuilder;
            
            beforeEach(function() {
               //Ceate a new pactBuilder
                pactBuilder = new PactBuilder("pact-consumer", "pact-provider", "1234");

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
                            )
                    ]);
            });

            it("get the expected response", function () {
                
                //Test Client - i.e., the actual test
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
        });
    });