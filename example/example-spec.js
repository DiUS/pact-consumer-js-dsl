define(['jquery', 'pactBuilder', 'interaction'],
    function ($, PactBuilder, Given) {

        describe("example pact test", function () {
            var pactProvider;
            var url;

            it("get the expected response", function () {
                pactProvider = new PactBuilder("pact-consumer", "pact-provider");
                var expectedResponse = {
                    name: "fuying"
                };

                pactProvider
                    .withInteractions([
                        Given("have item")
                            .uponReceiving("get item name")
                            .withRequest(
                                path = "/item",
                                method = "GET",
                                headers = {}
                            )
                            .willRespondWith(
                                status = 200,
                                headers = {},
                                body = expectedResponse)
                    ]);

                var setClientEndPoint = function (port) {
                    url = "http://localhost:" + port + "/item";
                };

                var testClient = function (completed) {
                    $.ajax({
                        url: url
                    }).done(function(data){
                        data = JSON.parse(data);
                        expect(data.name).toBe("fuying");
                        completed();
                    });
                };

                pactProvider.runPact(setClientEndPoint, testClient);
            });
        });
    });