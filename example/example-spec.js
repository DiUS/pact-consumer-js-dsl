define(['jquery', 'pactBuilder', 'interaction'],
    function ($, PactBuilder, Given) {

        describe("example pact test", function () {
            var pactProvider;
            var url;
            it("get the expected response", function () {
                pactProvider = new PactBuilder("pact-consumer", "pact-provider");
                var expectedResponse = {
                    foo: "bar"
                };

                pactProvider
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
                                body = expectedResponse)
                    ]);

                var testClient = function (port, completed) {
                    url = "http://localhost:" + port + "/foo";
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
                pactProvider.runInteractions(testClient);
            });
        });
    });