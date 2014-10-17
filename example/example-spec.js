define(['jquery', 'pactBuilder', 'interaction'],
    function ($, PactBuilder, Given) {

        describe("example pact test", function () {
            var pactProvider;
            var url;
            console.log("In test describe");
            it("get the expected response", function () {
                console.log("In test case get the expected response");
                debugger;
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
                                method = "GET"
                            )
                            .willRespondWith(
                                status = 200,
                                headers = { "Content-Type": "application/json"},
                                body = expectedResponse)
                    ]);

                var setClientEndPoint = function (port) {
                    url = "http://localhost:" + port + "/foo";
                };

                var testClient = function (completed) {
                    $.ajax({
                        url: url
                    }).done(function(data){
                        data = JSON.parse(data);
                        expect(data.foo).toBe("bar");
                        completed();
                    });
                };

                pactProvider.runPact(setClientEndPoint, testClient);
            });
        });
    });